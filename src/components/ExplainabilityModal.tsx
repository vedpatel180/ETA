import React from 'react';
import { 
  X, 
  AlertCircle, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  CloudFog, 
  Radio, 
  Wrench, 
  Gauge,
  Sparkles
} from 'lucide-react';
import { LiveTrainState, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: LiveTrainState;
  currentLang: LanguageCode;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  isOpen,
  onClose,
  train,
  currentLang
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];
  const nextStop = train.stops[Math.min(train.currentStationIndex, train.stops.length - 1)];
  const factors = nextStop?.eta?.explainability || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="explainability-modal-card"
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#003399]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                DYNAMIC ML EXPLAINABILITY
              </h2>
              <h3 className="text-xl font-black uppercase text-[#111111]">
                {t.factorsDrivingDelay}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-black rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Summary */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">Target Station:</span>
            <h4 className="text-base font-black text-[#111111] uppercase">
              {nextStop.stationNameLocal?.[currentLang] || nextStop.stationName} ({nextStop.stationCode})
            </h4>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400">Dynamic Forecast</span>
              <div className="text-lg font-black font-mono text-[#003399]">{nextStop.eta.predictedArrival}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400">Scheduled</span>
              <div className="text-base font-mono font-bold text-slate-500">{nextStop.scheduledArrival}</div>
            </div>
          </div>
        </div>

        {/* Factors Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Contributing Real-Time Factors & Physics Adjustments
          </h4>

          {factors.length === 0 ? (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
              <span>Train is running within normal schedule variance (+0 min delay). All block sections clear.</span>
            </div>
          ) : (
            factors.map((factor) => {
              const isPositiveDelay = factor.impactMinutes > 0;
              return (
                <div
                  key={factor.id}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                    isPositiveDelay
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-green-50/60 border-green-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {factor.category === 'WEATHER' && <CloudFog className="w-4 h-4 text-amber-600" />}
                      {factor.category === 'SIGNAL' && <Radio className="w-4 h-4 text-green-600" />}
                      {factor.category === 'PRECEDING_TRAIN' && <TrendingDown className="w-4 h-4 text-red-600" />}
                      {factor.category === 'SPEED_RESTRICTION' && <Gauge className="w-4 h-4 text-blue-600" />}
                      {factor.category === 'CONGESTION' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                      {factor.category === 'MAINTENANCE' && <Wrench className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#111111] uppercase tracking-wide">
                          {factor.category.replace('_', ' ')}
                        </span>
                        {factor.locationSection && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                            {factor.locationSection}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                        {factor.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg ${
                        isPositiveDelay
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-green-100 text-green-900 border border-green-300'
                      }`}
                    >
                      {isPositiveDelay ? `+${factor.impactMinutes} MIN` : `${factor.impactMinutes} MIN`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Model Architecture Note */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-center gap-1.5 text-[#003399] font-black uppercase tracking-wide mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Why Dynamic ETA is superior to Schedule-plus-Delay:</span>
          </div>
          Traditional NTES systems simply add the current delay to all downstream stops. The Dynamic ML model fuses 
          real-time GPS speed, COA section occupancy, signal aspects, weather severity, and engineering recovery slacks 
          to forecast exact arrival times with a 90% confidence interval.
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#003399] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
