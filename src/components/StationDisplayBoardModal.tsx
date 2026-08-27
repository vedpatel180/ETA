import React, { useState } from 'react';
import { X, Tv, Clock, AlertTriangle, ArrowRight, Volume2 } from 'lucide-react';
import { STATION_CONCOURSE_FEEDS } from '../data/trainsData';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';
import { playRailwayChime } from '../utils/audioChime';

interface StationDisplayBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
}

export const StationDisplayBoardModal: React.FC<StationDisplayBoardModalProps> = ({
  isOpen,
  onClose,
  currentLang
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];
  const [activeStation, setActiveStation] = useState<'NDLS' | 'MMCT' | 'CNB'>('NDLS');

  const stationLabels = {
    NDLS: 'New Delhi (NDLS) - Central Concourse Display',
    MMCT: 'Mumbai Central (MMCT) - Main Passenger Terminal',
    CNB: 'Kanpur Central (CNB) - North Central Railway Hub'
  };

  const currentFeeds = STATION_CONCOURSE_FEEDS[activeStation] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div 
        id="station-display-modal-card"
        className="w-full max-w-4xl bg-slate-950 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
      >
        {/* LED Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-amber-400">INDIAN RAILWAYS DIGITAL DISPLAY BOARD</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h3 className="text-lg font-black text-white tracking-wide font-mono uppercase">
                {stationLabels[activeStation]}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => playRailwayChime()}
              className="p-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 hover:bg-slate-800 transition-colors"
              title="Station Chime"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Station Tabs */}
        <div className="flex items-center gap-2 my-4">
          {(['NDLS', 'MMCT', 'CNB'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setActiveStation(st)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeStation === st
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st} Platform Board
            </button>
          ))}
        </div>

        {/* Real-time Electronic Departure / Arrival Board */}
        <div className="bg-black border-2 border-amber-600/60 rounded-2xl p-4 font-mono shadow-inner">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-amber-900/60 text-amber-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Train No.</th>
                  <th className="py-2.5 px-3">Train Name</th>
                  <th className="py-2.5 px-3">Origin / Destination</th>
                  <th className="py-2.5 px-3">Sched.</th>
                  <th className="py-2.5 px-3 text-amber-300">Expected ETA</th>
                  <th className="py-2.5 px-3 text-center text-amber-300">Platform</th>
                  <th className="py-2.5 px-3">Live Remarks / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-950/40">
                {currentFeeds.map((feed) => {
                  const isPlatformChanged = feed.statusType === 'platform_change';
                  return (
                    <tr key={feed.trainNumber} className="hover:bg-amber-950/20 transition-colors">
                      <td className="py-3 px-3 font-bold text-amber-400 whitespace-nowrap">
                        {feed.trainNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                        {feed.trainName}
                      </td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap text-[11px]">
                        {feed.source} ➔ {feed.destination}
                      </td>
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                        {feed.scheduledTime}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-400 whitespace-nowrap text-sm">
                        {feed.dynamicETA}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-sm font-black ${
                            isPlatformChanged
                              ? 'bg-amber-500 text-slate-950 animate-bounce'
                              : 'bg-amber-950 text-amber-300 border border-amber-700/80'
                          }`}
                        >
                          PF {feed.platform}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold ${
                            feed.statusType === 'platform_change'
                              ? 'text-amber-400 font-bold'
                              : feed.statusType === 'delayed'
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {feed.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* LED Scrolling Ticker */}
          <div className="mt-4 pt-3 border-t border-amber-900/60 flex items-center gap-2 text-xs text-amber-400 font-mono overflow-hidden">
            <span className="shrink-0 bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold text-[10px]">
              ANNOUNCEMENT
            </span>
            <div className="whitespace-nowrap animate-marquee">
              ⚠️ Attention Passengers: Train 12424 Dibrugarh Rajdhani has been re-allocated to Platform No. 9 due to yard maintenance. Please use the foot overbridge with elevator.
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors font-mono"
          >
            Close Board
          </button>
        </div>
      </div>
    </div>
  );
};
