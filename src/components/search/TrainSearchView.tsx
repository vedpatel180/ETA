import React, { useState } from 'react';
import { 
  Search, 
  Train, 
  Clock, 
  ArrowRight, 
  Filter, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { TrainData } from '../../types';

interface TrainSearchViewProps {
  trains: TrainData[];
  selectedTrain: TrainData;
  onSelectTrain: (train: TrainData) => void;
  onOpenDetails: () => void;
}

export const TrainSearchView: React.FC<TrainSearchViewProps> = ({
  trains,
  selectedTrain,
  onSelectTrain,
  onOpenDetails
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DELAYED' | 'ON_TIME'>('ALL');

  const filtered = trains.filter((t) => {
    const matchesQuery = 
      t.trainNumber.includes(filterQuery) ||
      t.trainName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.sourceName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.destinationName.toLowerCase().includes(filterQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (statusFilter === 'DELAYED') return t.currentDelayMinutes > 5;
    if (statusFilter === 'ON_TIME') return t.currentDelayMinutes <= 5;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Train Search & Fleet Directory
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Search active coaching rakes by train number, route name, or station code.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by Train No. (12901), Name (Gujarat Mail), or City..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['ALL', 'DELAYED', 'ON_TIME'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  statusFilter === filter
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'ALL' ? 'All Active' : filter === 'DELAYED' ? 'Delayed (>5m)' : 'On Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Train Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((train) => {
          const isSelected = selectedTrain.id === train.id;

          return (
            <div
              key={train.id}
              onClick={() => {
                onSelectTrain(train);
              }}
              className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer space-y-4 hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    <Train className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-base">
                      {train.trainNumber}
                    </div>
                    <div className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
                      {train.trainName}
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono ${
                  train.currentDelayMinutes > 15
                    ? 'bg-red-100 text-red-800'
                    : train.currentDelayMinutes > 5
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {train.currentDelayMinutes > 0 ? `+${train.currentDelayMinutes} min` : 'On Time'}
                </span>
              </div>

              {/* Route */}
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-900">{train.sourceName}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900">{train.destinationName}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Location</span>
                  <strong className="text-slate-800 text-xs truncate block">{train.currentLocationName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Destination ETA</span>
                  <strong className="text-blue-600 text-xs font-mono block">{train.destinationETA}</strong>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTrain(train);
                  onOpenDetails();
                }}
                className="w-full py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Inspect Telemetry & Forecast
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
