import React from 'react';
import { 
  Train, 
  MapPin, 
  CloudFog, 
  CloudRain, 
  Sun, 
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';
import { LiveTrainState, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface RouteMapVisualizerProps {
  train: LiveTrainState;
  currentLang: LanguageCode;
  onSelectStation: (stationCode: string) => void;
}

export const RouteMapVisualizer: React.FC<RouteMapVisualizerProps> = ({
  train,
  currentLang,
  onSelectStation
}) => {
  const t = translations[currentLang];
  const progressPct = Math.min(100, Math.max(0, (train.currentKm / train.totalKm) * 100));

  return (
    <section id="route-map-visualizer" className="w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-[#111111]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-1">
            TRACK CORRIDOR & TELEMETRY
          </h2>
          <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
            Live Signal & Station Alignment
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono font-bold">
          <span>{train.sourceStation}</span>
          <span>➔</span>
          <span>{train.destStation}</span>
          <span className="text-slate-300">|</span>
          <span className="text-[#003399] font-black">{train.currentKm} / {train.totalKm} KM</span>
        </div>
      </div>

      {/* Corridor Visual Canvas */}
      <div className="relative py-10 px-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
        {/* Track Line */}
        <div className="relative min-w-[650px] h-12 flex items-center">
          
          {/* Double Track Rail Lines */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1 h-1.5 bg-slate-300 border-y border-slate-400/40" />
          <div className="absolute left-0 right-0 top-1/2 translate-y-1.5 h-1.5 bg-slate-300 border-y border-slate-400/40" />

          {/* Active Travelled Track Glow */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1 h-4 bg-blue-100 border-t-2 border-b-2 border-[#003399] transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />

          {/* Station Markers along track */}
          {train.stops.map((stop, i) => {
            const stopPct = (stop.distanceKm / train.totalKm) * 100;
            const isPassed = i < train.currentStationIndex;
            const isNext = i === train.currentStationIndex;

            return (
              <div
                key={stop.stationCode}
                onClick={() => onSelectStation(stop.stationCode)}
                className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer group"
                style={{ left: `${stopPct}%` }}
              >
                {/* Station Code & Name Bubble */}
                <div className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border transition-all mb-1 ${
                  isNext 
                    ? 'bg-[#003399] text-white border-[#003399] shadow-md scale-110' 
                    : isPassed
                    ? 'bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-white text-slate-500 border-slate-300 group-hover:border-slate-400'
                }`}>
                  {stop.stationCode}
                </div>

                {/* Pin Node on track */}
                <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                  isPassed
                    ? 'bg-[#003399] border-[#003399]'
                    : isNext
                    ? 'bg-white border-[#003399] ring-4 ring-blue-300 animate-pulse'
                    : 'bg-white border-slate-400 group-hover:border-slate-600'
                }`} />

                {/* Distance label */}
                <span className="text-[9px] text-slate-500 font-mono font-bold mt-1">
                  {stop.distanceKm}k
                </span>
              </div>
            );
          })}

          {/* Live Train Indicator Position */}
          <div
            className="absolute -translate-x-1/2 -top-5 z-10 flex flex-col items-center transition-all duration-700"
            style={{ left: `${progressPct}%` }}
          >
            {/* Train Badge with Speed */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] text-white text-[10px] font-black uppercase tracking-wider shadow-md mb-0.5 animate-bounce">
              <Train className="w-3 h-3 text-[#003399]" />
              <span>{train.currentSpeedKmH} km/h</span>
            </div>

            <div className="w-2.5 h-2.5 rotate-45 bg-[#111111]" />
          </div>

        </div>

        {/* Environmental Overlay Details */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Current Section:</span>
            <span className="text-[#111111] font-mono font-bold bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
              {train.trackSection}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>OHE 25kV Traction Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Activity className="w-3.5 h-3.5 text-green-600" />
              <span>Automatic Block Signalling</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
