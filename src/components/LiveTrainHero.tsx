import React from 'react';
import { 
  Train, 
  MapPin, 
  Gauge, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  CloudSun, 
  CloudFog, 
  CloudRain, 
  Zap, 
  Radio, 
  Bell, 
  Download, 
  Check, 
  Share2, 
  MessageSquare,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import { LiveTrainState, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface LiveTrainHeroProps {
  train: LiveTrainState;
  currentLang: LanguageCode;
  isSavedOffline: boolean;
  onSaveOffline: () => void;
  onOpenAlertModal: () => void;
  onOpenSMSModal: () => void;
  onExplainClick: () => void;
  onStationSelect: (stationCode: string) => void;
}

export const LiveTrainHero: React.FC<LiveTrainHeroProps> = ({
  train,
  currentLang,
  isSavedOffline,
  onSaveOffline,
  onOpenAlertModal,
  onOpenSMSModal,
  onExplainClick,
  onStationSelect
}) => {
  const t = translations[currentLang];

  const nextStop = train.stops[Math.min(train.currentStationIndex, train.stops.length - 1)];
  const lastStop = train.currentStationIndex > 0 ? train.stops[train.currentStationIndex - 1] : train.stops[0];
  const finalStop = train.stops[train.stops.length - 1];
  const delay = nextStop?.eta?.delayMinutes || 0;
  const progressPct = Math.min(100, Math.max(0, Math.round((train.currentKm / train.totalKm) * 100)));

  // Clean train display name without repeating number
  const trainNameOnly = train.trainName.replace(train.trainNumber, '').replace(/^[-—\s]+/, '').trim() || train.trainName;

  // Signal Aspect Indicator
  const renderSignalBadge = () => {
    switch (train.signalAspect) {
      case 'CLEAR_GREEN':
        return (
          <span className="flex items-center gap-1.5 text-green-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-green-500 -ml-3.5" />
            Clear Green Signal
          </span>
        );
      case 'ATTENTION_DOUBLE_YELLOW':
        return (
          <span className="flex items-center gap-1.5 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Double Yellow (Attention)
          </span>
        );
      case 'CAUTION_YELLOW':
        return (
          <span className="flex items-center gap-1.5 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Yellow (Caution 30 km/h)
          </span>
        );
      case 'STOP_RED':
        return (
          <span className="flex items-center gap-1.5 text-rose-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            Red Signal (Line Clearance Hold)
          </span>
        );
    }
  };

  return (
    <section id="train-hero-section" className="w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden text-[#111111]">
      
      {/* Top Header: Train Info & Real-Time Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-8 border-b border-slate-100">
        <div>
          <h2 className="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">
            CURRENT TRAIN
          </h2>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-none text-[#111111]">
            {train.trainNumber} <span className="text-[#003399] uppercase">{trainNameOnly}</span>
          </h1>
          <p className="text-base sm:text-xl font-medium text-slate-500 mt-2">
            {train.sourceStation} → {train.destStation} <span className="text-slate-300 mx-2">•</span> Zone {train.zone} ({train.trainType.replace('_', ' ')})
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">
            STATUS
          </div>
          <div>
            {delay === 0 ? (
              <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded inline-block text-xs sm:text-sm font-black uppercase tracking-widest">
                ON TIME
              </span>
            ) : delay > 0 ? (
              <span className="bg-amber-100 text-amber-800 px-4 py-1.5 rounded inline-block text-xs sm:text-sm font-black uppercase tracking-widest">
                DELAYED +{delay} MIN
              </span>
            ) : (
              <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded inline-block text-xs sm:text-sm font-black uppercase tracking-widest">
                EARLY {Math.abs(delay)} MIN
              </span>
            )}
          </div>
          <div className="mt-2 text-xs font-mono text-slate-400">
            Current Speed: <strong className="text-[#111111]">{train.currentSpeedKmH} km/h</strong> (Max {train.maxSpeedKmH})
          </div>
        </div>
      </div>

      {/* Main Massive Metric Hero Area: ETA vs Platform */}
      <div className="py-10 sm:py-14 flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-12 border-b border-slate-100">
        
        {/* Left: Dynamic Estimated Arrival */}
        <div className="flex-1">
          <div className="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 sm:mb-4 flex items-center justify-between">
            <span>{t.dynamicETA} ({nextStop?.stationCode})</span>
            <span className="text-[11px] font-bold text-[#003399] tracking-normal">
              {nextStop?.eta?.confidenceScore}% ML Confidence
            </span>
          </div>

          <div className="text-6xl sm:text-8xl lg:text-[130px] xl:text-[150px] font-black leading-none tracking-tighter text-[#111111] font-mono">
            {nextStop?.eta?.predictedArrival}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-slate-500 font-mono">
            <span>Sched: <strong className="text-slate-700">{nextStop?.scheduledArrival}</strong></span>
            <span>•</span>
            <span>90% Interval: <strong className="text-slate-700">{nextStop?.eta?.predictionIntervalMin} – {nextStop?.eta?.predictionIntervalMax}</strong></span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-[1px] h-36 lg:h-48 bg-slate-200" />

        {/* Right: Platform Number Display */}
        <div className="flex-1 md:pl-8 lg:pl-12">
          <div className="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 sm:mb-4 flex items-center justify-between">
            <span>PLATFORM</span>
            {nextStop?.isPlatformChanged && (
              <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider">
                ⚠️ Platform Updated
              </span>
            )}
          </div>

          <div className="text-6xl sm:text-8xl lg:text-[130px] xl:text-[150px] font-black leading-none tracking-tighter text-[#111111] font-mono">
            {nextStop?.platform < 10 ? `0${nextStop?.platform}` : nextStop?.platform}
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm text-slate-500">
            <span className="font-bold text-[#111111]">{nextStop?.stationNameLocal?.[currentLang] || nextStop?.stationName}</span>
            <span>•</span>
            <span>{nextStop?.distanceKm - train.currentKm > 0 ? `${(nextStop.distanceKm - train.currentKm).toFixed(1)} km away` : 'Approaching station'}</span>
          </div>
        </div>

      </div>

      {/* 4-Column Bottom Layout Matching Design HTML */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 items-center">
        
        {/* Column 1: Last Passed / Current Corridor */}
        <div className="border-l-4 border-[#003399] pl-6 py-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Last Passed
          </div>
          <div className="text-lg font-black uppercase text-[#111111]">
            {lastStop.stationName}
          </div>
          <div className="text-xs font-bold text-slate-400 font-mono">
            {lastStop.scheduledDeparture || lastStop.scheduledArrival} • Section {train.trackSection}
          </div>
        </div>

        {/* Column 2: Next Stop Card */}
        <div 
          onClick={() => onStationSelect(nextStop.stationCode)}
          className="bg-slate-50 p-6 rounded-xl relative border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Next Stop
          </div>
          <div className="text-lg font-black uppercase text-[#111111] truncate max-w-[170px]">
            {nextStop.stationName}
          </div>
          <div className="text-xs font-bold text-slate-400 font-mono">
            {nextStop.eta.predictedArrival} • {Math.max(0, Math.round(nextStop.distanceKm - train.currentKm))}km
          </div>
          <div className="absolute top-5 right-5 w-7 h-7 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-200">
            <ArrowRight className="w-3.5 h-3.5 text-[#003399]" />
          </div>
        </div>

        {/* Column 3: Destination */}
        <div className="p-6 rounded-xl bg-white border border-slate-100 sm:border-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Destination
          </div>
          <div className="text-lg font-black uppercase text-[#111111] truncate max-w-[170px]">
            {finalStop.stationName}
          </div>
          <div className="text-xs font-bold text-slate-400 font-mono">
            {finalStop.eta.predictedArrival} • {Math.max(0, Math.round(train.totalKm - train.currentKm))}km remaining
          </div>
        </div>

        {/* Column 4: Main Notify on Arrival CTA + Utility Actions */}
        <div className="flex flex-col justify-center items-start sm:items-end gap-2.5">
          <button 
            id="btn-hero-notify"
            onClick={onOpenAlertModal}
            className="w-full sm:w-auto bg-[#111111] text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-[#003399] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            <span>Notify on Arrival</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onSaveOffline}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors ${
                isSavedOffline
                  ? 'bg-blue-50 border-[#003399] text-[#003399]'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-[#111111]'
              }`}
            >
              {isSavedOffline ? '✓ Saved Offline' : 'Save Offline'}
            </button>

            <button
              onClick={onExplainClick}
              className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#111111] transition-colors"
            >
              Explain Delay ({nextStop?.eta?.explainability?.length || 0})
            </button>
          </div>
        </div>

      </div>

      {/* Environmental & Signal Telemetry Bar */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Signal Relay:</span>
            {renderSignalBadge()}
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500 font-mono text-xs">
          <span>OHE 25kV Traction Active</span>
          <span>•</span>
          <span>Journey Progress: <strong className="text-[#111111] font-bold">{progressPct}%</strong></span>
        </div>
      </div>

    </section>
  );
};
