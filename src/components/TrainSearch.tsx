import React, { useState } from 'react';
import { Search, Train, Sparkles, MapPin, ArrowRight, Zap, Flame } from 'lucide-react';
import { LiveTrainState, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface TrainSearchProps {
  trains: LiveTrainState[];
  selectedTrain: LiveTrainState;
  onSelectTrain: (train: LiveTrainState) => void;
  currentLang: LanguageCode;
}

export const TrainSearch: React.FC<TrainSearchProps> = ({
  trains,
  selectedTrain,
  onSelectTrain,
  currentLang
}) => {
  const t = translations[currentLang];
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VANDE_BHARAT' | 'RAJวางHANI' | 'SHATABDI' | 'SUPERFAST'>('ALL');

  const filteredTrains = trains.filter((train) => {
    const matchesFilter = activeFilter === 'ALL' || train.trainType === activeFilter;
    const lowerQ = query.toLowerCase().trim();
    if (!lowerQ) return matchesFilter;
    const matchesText =
      train.trainNumber.toLowerCase().includes(lowerQ) ||
      train.trainName.toLowerCase().includes(lowerQ) ||
      train.sourceStation.toLowerCase().includes(lowerQ) ||
      train.destStation.toLowerCase().includes(lowerQ) ||
      train.stops.some((s) => s.stationName.toLowerCase().includes(lowerQ) || s.stationCode.toLowerCase().includes(lowerQ));
    return matchesFilter && matchesText;
  });

  return (
    <section id="train-search-section" className="w-full">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
          <input
            id="train-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-32 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-[#003399] rounded-2xl text-[#111111] placeholder-slate-400 text-sm font-bold transition-all shadow-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-28 text-xs font-bold uppercase text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Clear
            </button>
          )}
          <span className="absolute right-3 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-black uppercase tracking-wider text-[#003399] select-none">
            {filteredTrains.length} Trains
          </span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeFilter === 'ALL'
              ? 'bg-[#111111] text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          All Express Trains
        </button>
        <button
          onClick={() => setActiveFilter('VANDE_BHARAT')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeFilter === 'VANDE_BHARAT'
              ? 'bg-[#003399] text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Vande Bharat 160 km/h
        </button>
        <button
          onClick={() => setActiveFilter('RAJวางHANI')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeFilter === 'RAJวางHANI'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-300" />
          Rajdhani / Tejas
        </button>
        <button
          onClick={() => setActiveFilter('SHATABDI')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeFilter === 'SHATABDI'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          Shatabdi
        </button>
        <button
          onClick={() => setActiveFilter('SUPERFAST')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeFilter === 'SUPERFAST'
              ? 'bg-indigo-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          Superfast Express
        </button>
      </div>

      {/* Train Selector Horizontal Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {filteredTrains.map((train) => {
          const isSelected = selectedTrain.trainNumber === train.trainNumber;
          const nextStop = train.stops[Math.min(train.currentStationIndex, train.stops.length - 1)];
          const delay = nextStop?.eta?.delayMinutes || 0;

          return (
            <button
              key={train.trainNumber}
              id={`train-card-${train.trainNumber}`}
              onClick={() => onSelectTrain(train)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-blue-50/50 border-2 border-[#003399] shadow-md ring-1 ring-[#003399]/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-[#003399] border border-slate-200">
                    {train.trainNumber}
                  </span>
                  <span className="text-xs font-black text-[#111111] uppercase truncate max-w-[130px]">
                    {train.trainName.replace(train.trainNumber, '').replace(/^[-—\s]+/, '').trim() || train.trainName}
                  </span>
                </div>
                {/* Delay Pill */}
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    delay === 0
                      ? 'bg-green-100 text-green-700'
                      : delay > 15
                      ? 'bg-red-100 text-red-700'
                      : delay > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {delay === 0 ? 'On Time' : delay > 0 ? `+${delay}m` : `${delay}m`}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
                <div className="flex items-center gap-1 font-mono font-medium">
                  <span>{train.sourceStation}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>{train.destStation}</span>
                </div>
                <span className="text-[11px] text-slate-700 font-mono font-bold">
                  {train.currentSpeedKmH} km/h
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
