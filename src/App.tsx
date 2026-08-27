import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ToastNotificationHost } from './components/ToastNotificationHost';
import { TrainSearch } from './components/TrainSearch';
import { LiveTrainHero } from './components/LiveTrainHero';
import { RouteMapVisualizer } from './components/RouteMapVisualizer';
import { StationTimeline } from './components/StationTimeline';
import { ExplainabilityModal } from './components/ExplainabilityModal';
import { StationDisplayBoardModal } from './components/StationDisplayBoardModal';
import { OfflineAlertsModal } from './components/OfflineAlertsModal';
import { ArrivalAlertsModal } from './components/ArrivalAlertsModal';
import { ControlRoomModal } from './components/ControlRoomModal';

import { INITIAL_TRAINS } from './data/trainsData';
import { LiveTrainState, LanguageCode, SignalAspect, WeatherCondition } from './types';
import { translations } from './data/translations';
import { recomputeTrainETAs, parseTimeToMinutes } from './utils/predictionEngine';
import { saveTrainForOffline, isTrainSavedOffline, getOfflineTrains } from './utils/offlineStorage';
import { getSavedNotificationRules, sendStationArrivalAlert, emitToast } from './utils/notifications';
import { 
  WifiOff, 
  ShieldCheck, 
  PhoneCall, 
  HelpCircle, 
  Train, 
  CheckCircle2,
  Tv,
  BellRing
} from 'lucide-react';

export default function App() {
  const [trains, setTrains] = useState<LiveTrainState[]>(INITIAL_TRAINS);
  const [selectedTrain, setSelectedTrain] = useState<LiveTrainState>(INITIAL_TRAINS[0]);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeAlertStation, setActiveAlertStation] = useState<string | undefined>(undefined);

  // Modals state
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);
  const [isDisplayBoardModalOpen, setIsDisplayBoardModalOpen] = useState<boolean>(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [isArrivalAlertsModalOpen, setIsArrivalAlertsModalOpen] = useState<boolean>(false);
  const [isControlRoomModalOpen, setIsControlRoomModalOpen] = useState<boolean>(false);

  const [savedCount, setSavedCount] = useState<number>(getOfflineTrains().length);

  const t = translations[currentLang];
  const isSaved = isTrainSavedOffline(selectedTrain.trainNumber);

  // Periodic simulated live progress ticker
  useEffect(() => {
    if (isOffline) return; // In offline mode, do not simulate external streaming feed

    const interval = setInterval(() => {
      setTrains((prevTrains) =>
        prevTrains.map((train) => {
          if (train.currentKm >= train.totalKm) return train;

          // Increment km slightly
          const nextKm = Math.min(train.totalKm, train.currentKm + 0.3);
          
          // Determine current station index based on distance
          let currentStationIdx = train.currentStationIndex;
          for (let i = 0; i < train.stops.length; i++) {
            if (nextKm < train.stops[i].distanceKm) {
              currentStationIdx = i;
              break;
            }
          }

          // Small natural speed oscillation (e.g. ±2 km/h)
          const speedDelta = (Math.random() - 0.5) * 4;
          const newSpeed = Math.min(train.maxSpeedKmH, Math.max(0, Math.round(train.currentSpeedKmH + speedDelta)));

          const updated = {
            ...train,
            currentKm: Number(nextKm.toFixed(1)),
            currentSpeedKmH: newSpeed,
            currentStationIndex: currentStationIdx
          };

          return recomputeTrainETAs(updated);
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isOffline]);

  // Keep selectedTrain synced with updated state
  useEffect(() => {
    const fresh = trains.find((t) => t.trainNumber === selectedTrain.trainNumber);
    if (fresh) {
      setSelectedTrain(fresh);
    }
  }, [trains, selectedTrain.trainNumber]);

  // Proximity Alert Checker
  useEffect(() => {
    const rules = getSavedNotificationRules().filter((r) => r.isEnabled && r.trainNumber === selectedTrain.trainNumber);
    if (rules.length === 0) return;

    rules.forEach((rule) => {
      const stop = selectedTrain.stops.find((s) => s.stationCode === rule.stationCode);
      if (!stop) return;

      const remainingDistance = stop.distanceKm - selectedTrain.currentKm;
      // If train is within 10 km or within arrival threshold
      if (remainingDistance > 0 && remainingDistance <= 12) {
        // Trigger alert only once per session
        const alertSessionKey = `alerted_${rule.trainNumber}_${rule.stationCode}`;
        if (!sessionStorage.getItem(alertSessionKey)) {
          sessionStorage.setItem(alertSessionKey, 'true');
          sendStationArrivalAlert(
            selectedTrain.trainName,
            stop.stationName,
            stop.eta.predictedArrival,
            stop.platform,
            rule.wakeUpAlarm
          );
        }
      }
    });
  }, [selectedTrain]);

  const handleSelectTrain = (train: LiveTrainState) => {
    setSelectedTrain(train);
    setActiveAlertStation(train.destStation);
  };

  const handleSaveOffline = () => {
    saveTrainForOffline(selectedTrain);
    setSavedCount(getOfflineTrains().length);
    emitToast({
      title: 'Journey Saved Offline',
      body: `${selectedTrain.trainName} full schedule & dynamic model cached in local storage.`,
      type: 'info'
    });
  };

  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    emitToast({
      title: next ? 'Switched to Offline Mode' : 'Connected to Live Railway Feed',
      body: next 
        ? 'Displaying locally cached predictions and offline SMS 139 backup enquiry tools.' 
        : 'Live GPS, COA signal, and weather data feeds restored.',
      type: next ? 'platform' : 'arrival'
    });
  };

  const handleOpenAlertForStation = (stationCode: string) => {
    setActiveAlertStation(stationCode);
    setIsArrivalAlertsModalOpen(true);
  };

  const handleSimulateScenario = (updates: {
    customDelayMinutes?: number;
    overrideSignal?: SignalAspect;
    overrideWeather?: WeatherCondition;
    overrideSpeed?: number;
    platformChangeStation?: string;
  }) => {
    let updated = recomputeTrainETAs(selectedTrain, updates);
    if (updates.platformChangeStation) {
      updated = {
        ...updated,
        stops: updated.stops.map((s) => {
          if (s.stationCode === updates.platformChangeStation) {
            const newPf = s.platform === 1 ? 4 : 1;
            return {
              ...s,
              platform: newPf,
              isPlatformChanged: true,
              platformChangeReason: 'Operational yard congestion reallocation.'
            };
          }
          return s;
        })
      };
    }

    setTrains((prev) =>
      prev.map((t) => (t.trainNumber === updated.trainNumber ? updated : t))
    );
    setSelectedTrain(updated);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111111] flex flex-col font-sans selection:bg-[#003399] selection:text-white">
      
      {/* Toast Notifications */}
      <ToastNotificationHost />

      {/* Main Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        onOpenStationBoard={() => setIsDisplayBoardModalOpen(true)}
        onOpenControlRoom={() => setIsControlRoomModalOpen(true)}
        onOpenOfflineManager={() => setIsOfflineModalOpen(true)}
        onOpenAlertsManager={() => {
          setActiveAlertStation(selectedTrain.destStation);
          setIsArrivalAlertsModalOpen(true);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        activeSavedCount={savedCount}
      />

      {/* Offline Alert Strip (Visible when in offline mode) */}
      {isOffline && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-3 text-amber-950 text-xs font-bold text-center flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-800 shrink-0" />
          <span>
            <strong className="uppercase tracking-wider font-black">{t.offlineModeActive}</strong> — Internet disconnected. Utilizing cached timetables and device clock. For zero-data tracking, use{' '}
            <button 
              onClick={() => setIsOfflineModalOpen(true)} 
              className="underline font-black text-[#003399] hover:text-black"
            >
              SMS 139 SPOT
            </button>
            .
          </span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Search & Category Filter */}
        <TrainSearch
          trains={trains}
          selectedTrain={selectedTrain}
          onSelectTrain={handleSelectTrain}
          currentLang={currentLang}
        />

        {/* Live Train Hero Card with Dynamic ML Forecast */}
        <LiveTrainHero
          train={selectedTrain}
          currentLang={currentLang}
          isSavedOffline={isSaved}
          onSaveOffline={handleSaveOffline}
          onOpenAlertModal={() => {
            setActiveAlertStation(selectedTrain.destStation);
            setIsArrivalAlertsModalOpen(true);
          }}
          onOpenSMSModal={() => setIsOfflineModalOpen(true)}
          onExplainClick={() => setIsExplainModalOpen(true)}
          onStationSelect={(st) => handleOpenAlertForStation(st)}
        />

        {/* Route Map & Signal Visualizer */}
        <RouteMapVisualizer
          train={selectedTrain}
          currentLang={currentLang}
          onSelectStation={(st) => handleOpenAlertForStation(st)}
        />

        {/* Station Timeline with Dynamic ETAs & Platform Info */}
        <StationTimeline
          train={selectedTrain}
          currentLang={currentLang}
          onSetStationAlert={handleOpenAlertForStation}
          onSelectStation={(st) => handleOpenAlertForStation(st)}
        />

      </main>

      {/* Footnote / Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003399] flex items-center justify-center text-white font-black shadow-sm">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm uppercase tracking-tight text-[#111111]">
                RAILETA • SMART INDIA HACKATHON 2026 (PS ID: 26028)
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Dynamic Forecast of Expected Time of Arrival (ETA) for Coaching Trains — Ministry of Railways
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-wider">
            <button
              onClick={() => setIsDisplayBoardModalOpen(true)}
              className="text-slate-600 hover:text-[#003399] transition-colors flex items-center gap-1.5"
            >
              <Tv className="w-4 h-4" />
              <span>Concourse Display</span>
            </button>
            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className="text-slate-600 hover:text-[#003399] transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>139 SMS & SOS</span>
            </button>
            <button
              onClick={() => setIsControlRoomModalOpen(true)}
              className="text-slate-600 hover:text-[#003399] transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Control Room (SIH Metrics)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExplainabilityModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        train={selectedTrain}
        currentLang={currentLang}
      />

      <StationDisplayBoardModal
        isOpen={isDisplayBoardModalOpen}
        onClose={() => setIsDisplayBoardModalOpen(false)}
        currentLang={currentLang}
      />

      <OfflineAlertsModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        currentTrain={selectedTrain}
        onSelectTrain={handleSelectTrain}
        currentLang={currentLang}
      />

      <ArrivalAlertsModal
        isOpen={isArrivalAlertsModalOpen}
        onClose={() => setIsArrivalAlertsModalOpen(false)}
        train={selectedTrain}
        selectedStationCode={activeAlertStation}
        currentLang={currentLang}
      />

      <ControlRoomModal
        isOpen={isControlRoomModalOpen}
        onClose={() => setIsControlRoomModalOpen(false)}
        train={selectedTrain}
        onSimulateScenario={handleSimulateScenario}
        currentLang={currentLang}
      />

    </div>
  );
}
