import React, { useState, useEffect } from 'react';
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
import { AuthScreen } from './components/AuthScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

import { INITIAL_TRAINS } from './data/trainsData';
import { LiveTrainState, LanguageCode, SignalAspect, WeatherCondition } from './types';
import { translations } from './data/translations';
import { recomputeTrainETAs } from './utils/predictionEngine';
import { saveTrainForOffline, isTrainSavedOffline, getOfflineTrains } from './utils/offlineStorage';
import { getSavedNotificationRules, sendStationArrivalAlert, emitToast } from './utils/notifications';
import { 
  WifiOff, 
  ShieldCheck, 
  PhoneCall, 
  Train, 
  CheckCircle2,
  Tv,
  BellRing,
  Sparkles,
  Loader2
} from 'lucide-react';

function MainTrainDashboard({
  currentLang,
  setCurrentLang
}: {
  currentLang: LanguageCode;
  setCurrentLang: (lang: LanguageCode) => void;
}) {
  const [trains, setTrains] = useState<LiveTrainState[]>(INITIAL_TRAINS);
  const [selectedTrain, setSelectedTrain] = useState<LiveTrainState>(INITIAL_TRAINS[0]);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeAlertStation, setActiveAlertStation] = useState<string | undefined>(undefined);

  // Modals state
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);
  const [isDisplayBoardModalOpen, setIsDisplayBoardModalOpen] = useState<boolean>(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [isArrivalAlertsModalOpen, setIsArrivalAlertsModalOpen] = useState<boolean>(false);
  const [isControlRoomModalOpen, setIsControlRoomModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

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
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
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

      {/* Main App Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Train Search Component */}
        <TrainSearch
          trains={trains}
          selectedTrain={selectedTrain}
          onSelectTrain={handleSelectTrain}
          currentLang={currentLang}
        />

        {/* Live Train Hero Card with Dynamic ML ETA and Telemetry */}
        <LiveTrainHero
          train={selectedTrain}
          onOpenExplainability={() => setIsExplainModalOpen(true)}
          onOpenArrivalAlerts={() => {
            setActiveAlertStation(selectedTrain.destStation);
            setIsArrivalAlertsModalOpen(true);
          }}
          onSaveOffline={handleSaveOffline}
          isSavedOffline={isSaved}
          currentLang={currentLang}
        />

        {/* Route Map Visualizer & Live Linear Tracker */}
        <RouteMapVisualizer
          train={selectedTrain}
          onSelectStation={handleOpenAlertForStation}
          currentLang={currentLang}
        />

        {/* Station-by-Station Timetable, Delays, Confidence, and Platform Updates */}
        <StationTimeline
          train={selectedTrain}
          onOpenAlertForStation={handleOpenAlertForStation}
          currentLang={currentLang}
        />

      </main>

      {/* Footer & SIH 2026 Credits with Bold Typography */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-12 text-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#003399] flex items-center justify-center text-white font-black text-sm">
              IR
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#111111]">
                Smart India Hackathon 2026 • PS ID: 26028
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Ministry of Railways • Dynamic Expected Arrival & Platform Forecasting Architecture
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-black uppercase tracking-wider">
            <button
              onClick={() => setIsDisplayBoardModalOpen(true)}
              className="text-slate-600 hover:text-[#003399] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Tv className="w-4 h-4" />
              <span>Concourse Display</span>
            </button>
            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className="text-slate-600 hover:text-[#003399] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>139 SMS & SOS</span>
            </button>
            <button
              onClick={() => setIsControlRoomModalOpen(true)}
              className="text-slate-600 hover:text-[#003399] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Control Room Simulator</span>
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

      {/* Cloud Authentication Modal */}
      <AuthScreen
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
      />

    </div>
  );
}

function AppContent() {
  const { loading } = useAuth();
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#003399] text-white flex items-center justify-center shadow-lg font-black text-2xl animate-pulse">
          IR
        </div>
        <div className="flex items-center gap-2 text-slate-700 font-black text-xs uppercase tracking-widest">
          <Loader2 className="w-4 h-4 animate-spin text-[#003399]" />
          <span>Connecting to Firebase & Railway Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <MainTrainDashboard
      currentLang={currentLang}
      setCurrentLang={setCurrentLang}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
