import React from 'react';
import { 
  X, 
  Sliders, 
  Activity, 
  TrendingUp, 
  Radio, 
  CloudFog, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  Zap,
  Server,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { LiveTrainState, LanguageCode, SignalAspect, WeatherCondition } from '../types';
import { ZONAL_METRICS } from '../data/trainsData';
import { translations } from '../data/translations';
import { sendPlatformChangeAlert } from '../utils/notifications';

interface ControlRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: LiveTrainState;
  onSimulateScenario: (updates: {
    customDelayMinutes?: number;
    overrideSignal?: SignalAspect;
    overrideWeather?: WeatherCondition;
    overrideSpeed?: number;
    platformChangeStation?: string;
  }) => void;
  currentLang: LanguageCode;
}

export const ControlRoomModal: React.FC<ControlRoomModalProps> = ({
  isOpen,
  onClose,
  train,
  onSimulateScenario,
  currentLang
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];

  const handleTriggerSignalRed = () => {
    onSimulateScenario({
      overrideSignal: 'STOP_RED',
      overrideSpeed: 0,
      customDelayMinutes: 14
    });
  };

  const handleTriggerFog = () => {
    onSimulateScenario({
      overrideWeather: 'FOG',
      overrideSpeed: 70,
      customDelayMinutes: 18
    });
  };

  const handleTriggerPlatformChange = () => {
    const nextStop = train.stops[Math.min(train.currentStationIndex, train.stops.length - 1)];
    const newPf = nextStop.platform === 1 ? 4 : 1;
    sendPlatformChangeAlert(
      train.trainName,
      nextStop.stationName,
      newPf,
      nextStop.platform,
      'Operational yard congestion reallocation'
    );
    onSimulateScenario({
      platformChangeStation: nextStop.stationCode
    });
  };

  const handleRestoreNormal = () => {
    onSimulateScenario({
      overrideSignal: 'CLEAR_GREEN',
      overrideWeather: 'CLEAR',
      overrideSpeed: train.maxSpeedKmH,
      customDelayMinutes: 0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="control-room-modal-card"
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#003399]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-[#003399] uppercase tracking-wider">
                  SIH 2026 PS 26028 • MINISTRY OF RAILWAYS
                </span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
                Control Room & Observability Dashboard
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-black rounded-xl hover:bg-slate-100 transition-colors self-start sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Rolling MAE Forecast Accuracy Metrics */}
        <div className="my-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#003399]" />
              <span>Forecast Accuracy Metrics (Dynamic ML vs Static Timetable)</span>
            </h4>
            <span className="text-[11px] text-[#003399] font-mono font-black">
              National Avg Error: 2.3 min (87.9% Accuracy Boost)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ZONAL_METRICS.map((zone) => (
              <div
                key={zone.zoneCode}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#003399]">{zone.zoneCode}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{zone.activeTrains} trains</span>
                  </div>
                  <span className="text-xs text-slate-700 font-bold uppercase block mt-1">{zone.zoneName}</span>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-200">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 font-medium">ML MAE:</span>
                    <span className="font-mono font-black text-green-700">{zone.mlForecastMAE} min</span>
                  </div>
                  <div className="flex items-baseline justify-between text-[11px] text-slate-400 mt-0.5 font-medium">
                    <span>Static Sched:</span>
                    <span className="font-mono line-through text-slate-400">{zone.staticScheduleMAE} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Data Ingestion Feed Health Status */}
        <div className="my-5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-[#003399]" />
              <span>Unified Ingestion Layer Health (PRD Section 7.1 FR-1.1 - 1.7)</span>
            </h4>
            <span className="text-[10px] text-green-700 font-mono font-black">STATUS: 100% OPERATIONAL</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px] uppercase font-black">GPS Telemetry</span>
              <span className="text-sm font-black font-mono text-[#003399] mt-0.5 block">99.8% Uptime</span>
              <span className="text-[10px] text-slate-500">3s streaming</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px] uppercase font-black">COA Feed</span>
              <span className="text-sm font-black font-mono text-[#003399] mt-0.5 block">99.2% Health</span>
              <span className="text-[10px] text-slate-500">Block occupancy</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px] uppercase font-black">SMMS Signals</span>
              <span className="text-sm font-black font-mono text-[#003399] mt-0.5 block">98.9% Health</span>
              <span className="text-[10px] text-slate-500">Aspect relays</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px] uppercase font-black">TMS State</span>
              <span className="text-sm font-black font-mono text-[#003399] mt-0.5 block">98.1% Health</span>
              <span className="text-[10px] text-slate-500">Caution orders</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px] uppercase font-black">Radar Weather</span>
              <span className="text-sm font-black font-mono text-[#003399] mt-0.5 block">99.5% Health</span>
              <span className="text-[10px] text-slate-500">Fog / Rain radar</span>
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Real-Time Scenario Simulator */}
        <div className="my-5 p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#003399] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Interactive Real-Time Operational Scenario Injector</span>
            </h4>
            <span className="text-[10px] font-mono font-bold text-slate-500">Target: {train.trainName.split('-')[0]}</span>
          </div>

          <p className="text-xs text-slate-600 mb-4 font-medium">
            Trigger simulated operational disruptions or line clearances to test dynamic ML recalculation across all downstream stations in real-time:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Event 1: Red Signal Hold */}
            <button
              onClick={handleTriggerSignalRed}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase mb-1.5">
                <Radio className="w-4 h-4 text-red-600" />
                <span>Signal Red Hold</span>
              </div>
              <p className="text-xs text-slate-500 group-hover:text-red-900 leading-snug font-medium">
                Hold awaiting section crossing (+14m delay cascade).
              </p>
            </button>

            {/* Event 2: Dense Fog in Corridor */}
            <button
              onClick={handleTriggerFog}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase mb-1.5">
                <CloudFog className="w-4 h-4 text-amber-600" />
                <span>Dense Fog Alert</span>
              </div>
              <p className="text-xs text-slate-500 group-hover:text-amber-900 leading-snug font-medium">
                Enforce Fog-PASS 75 km/h restriction (+18m delay).
              </p>
            </button>

            {/* Event 3: Reallocate Platform */}
            <button
              onClick={handleTriggerPlatformChange}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-[#003399] font-black text-xs uppercase mb-1.5">
                <AlertTriangle className="w-4 h-4 text-[#003399]" />
                <span>Platform Switch</span>
              </div>
              <p className="text-xs text-slate-500 group-hover:text-blue-900 leading-snug font-medium">
                Station yard congestion shifting train to alternate platform.
              </p>
            </button>

            {/* Event 4: Restore Normal High Speed */}
            <button
              onClick={handleRestoreNormal}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-300 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-green-700 font-black text-xs uppercase mb-1.5">
                <RefreshCw className="w-4 h-4 text-green-600" />
                <span>Green Wave</span>
              </div>
              <p className="text-xs text-slate-500 group-hover:text-green-900 leading-snug font-medium">
                Clear all signals, resume 130+ km/h and recover schedule margins.
              </p>
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#003399] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
