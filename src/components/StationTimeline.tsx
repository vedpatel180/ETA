import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Bell, 
  Coffee, 
  Droplet, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MapPin,
  Flame
} from 'lucide-react';
import { LiveTrainState, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface StationTimelineProps {
  train: LiveTrainState;
  currentLang: LanguageCode;
  onSetStationAlert: (stationCode: string, stationName: string) => void;
  onSelectStation: (stationCode: string) => void;
}

export const StationTimeline: React.FC<StationTimelineProps> = ({
  train,
  currentLang,
  onSetStationAlert,
  onSelectStation
}) => {
  const t = translations[currentLang];

  return (
    <section id="station-timeline-section" className="w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-[#111111]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-1">
            SCHEDULE & PLATFORM MATRIX
          </h2>
          <h3 className="text-xl font-black uppercase tracking-tight text-[#111111] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#003399]" />
            <span>{t.allStations}</span>
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Passed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#003399] animate-pulse" />
            <span className="text-[#003399]">Next Stop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-400" />
            <span>Upcoming</span>
          </div>
        </div>
      </div>

      {/* Vertical Station Timeline */}
      <div className="space-y-3.5 relative">
        {train.stops.map((stop, index) => {
          const isPassed = index < train.currentStationIndex;
          const isNext = index === train.currentStationIndex;
          const isSource = index === 0;
          const delay = stop.eta.delayMinutes;
          const localizedName = stop.stationNameLocal?.[currentLang] || stop.stationName;

          return (
            <div 
              key={stop.stationCode}
              id={`station-row-${stop.stationCode}`}
              className={`relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all ${
                isNext
                  ? 'bg-blue-50/40 border-2 border-[#003399] shadow-md ring-1 ring-[#003399]/20'
                  : isPassed
                  ? 'bg-slate-50/60 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
              }`}
            >
              {/* Left Column: Station Name, Code, Platform */}
              <div className="flex items-start gap-4">
                {/* Node indicator */}
                <div className="relative mt-1">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono transition-colors ${
                      isPassed
                        ? 'bg-slate-200 text-slate-700 border border-slate-300'
                        : isNext
                        ? 'bg-[#003399] text-white shadow-sm animate-pulse'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4 text-slate-600" /> : index + 1}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base sm:text-lg font-black text-[#111111] uppercase tracking-tight">
                      {localizedName}
                    </h4>
                    {currentLang !== 'en' && (
                      <span className="text-xs text-slate-400 font-normal">
                        ({stop.stationName})
                      </span>
                    )}
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-[#003399] border border-slate-200">
                      {stop.stationCode}
                    </span>

                    {/* Platform Chip */}
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded border flex items-center gap-1 ${
                          stop.isPlatformChanged
                            ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                            : 'bg-slate-100 text-[#111111] border-slate-200'
                        }`}
                      >
                        <span>{t.platform} {stop.platform}</span>
                        {stop.isPlatformChanged && (
                          <span className="text-[10px] text-amber-700 font-bold">
                            (Was PF {stop.scheduledPlatform})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Distance and Amenities */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-mono font-medium">
                    <span>{stop.distanceKm} km</span>
                    {stop.haltMinutes > 0 && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>Halt: {stop.haltMinutes} min</span>
                      </>
                    )}
                    {stop.hasCatering && (
                      <span className="flex items-center gap-1 text-slate-500" title="Catering Available">
                        <Coffee className="w-3 h-3 text-amber-600" />
                        <span className="hidden sm:inline">Pantry</span>
                      </span>
                    )}
                    {stop.hasWaterFacility && (
                      <span className="flex items-center gap-1 text-slate-500" title="Clean Drinking Water Available">
                        <Droplet className="w-3 h-3 text-blue-600" />
                        <span className="hidden sm:inline">Water</span>
                      </span>
                    )}
                  </div>

                  {/* Platform Change Reason Warning */}
                  {stop.isPlatformChanged && stop.platformChangeReason && (
                    <div className="mt-2 text-xs p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{stop.platformChangeReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Time Comparison & Notification Trigger */}
              <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 mt-3 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                
                {/* Time Display */}
                <div className="text-left md:text-right space-y-0.5">
                  <div className="flex items-center md:justify-end gap-2">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t.dynamicETA}:</span>
                    <span className="font-mono text-base sm:text-lg font-black text-[#111111]">
                      {isSource ? stop.scheduledDeparture : stop.eta.predictedArrival}
                    </span>
                  </div>

                  <div className="flex items-center md:justify-end gap-2 text-xs text-slate-400 font-mono">
                    <span>Sched: {isSource ? stop.scheduledDeparture : stop.scheduledArrival}</span>
                    {stop.scheduledDeparture !== 'DEST' && !isSource && (
                      <span>(Dep: {stop.eta.predictedDeparture})</span>
                    )}
                  </div>

                  {/* Delay Tag */}
                  {!isSource && (
                    <div className="flex items-center md:justify-end">
                      {delay === 0 ? (
                        <span className="text-[11px] font-black uppercase text-green-700">
                          {t.onTime}
                        </span>
                      ) : delay > 0 ? (
                        <span className="text-[11px] font-black uppercase text-amber-800 flex items-center gap-0.5">
                          <TrendingDown className="w-3 h-3 text-amber-600" />
                          +{delay} MIN ({stop.eta.predictionIntervalMin}–{stop.eta.predictionIntervalMax})
                        </span>
                      ) : (
                        <span className="text-[11px] font-black uppercase text-blue-800 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          {Math.abs(delay)} MIN EARLY
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Alarm / Notify Button */}
                <button
                  id={`btn-notify-stop-${stop.stationCode}`}
                  onClick={() => onSetStationAlert(stop.stationCode, stop.stationName)}
                  title={`Set arrival alert for ${stop.stationName}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111111] hover:bg-[#003399] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify</span>
                </button>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
