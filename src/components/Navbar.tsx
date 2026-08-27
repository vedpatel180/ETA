import React from 'react';
import { 
  Train, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  Globe, 
  Sliders, 
  Tv, 
  BellRing, 
  DownloadCloud
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations, languageNames } from '../data/translations';
import { playRailwayChime } from '../utils/audioChime';

interface NavbarProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenStationBoard: () => void;
  onOpenControlRoom: () => void;
  onOpenOfflineManager: () => void;
  onOpenAlertsManager: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeSavedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  isOffline,
  onToggleOffline,
  onOpenStationBoard,
  onOpenControlRoom,
  onOpenOfflineManager,
  onOpenAlertsManager,
  soundEnabled,
  onToggleSound,
  activeSavedCount
}) => {
  const t = translations[currentLang];

  const handleChimeTest = () => {
    if (soundEnabled) {
      playRailwayChime();
    } else {
      onToggleSound();
    }
  };

  const quickLangs: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' }
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-[#111111] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title - Bold Typography Signature */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#003399] rounded-sm flex items-center justify-center text-white font-black text-xl shadow-sm tracking-tight shrink-0">
              IR
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] leading-tight block text-[#111111]">
                Indian Railways
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#003399]">
                Live Dynamic Forecast
              </span>
            </div>
          </div>

          {/* Center / Right Nav Tools with Bold Typography */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Quick Language Switcher */}
            <nav className="hidden md:flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {quickLangs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => onLanguageChange(l.code)}
                  className={`transition-all pb-1 ${
                    currentLang === l.code
                      ? 'text-[#111111] border-b-2 border-[#003399] font-black'
                      : 'hover:text-[#111111]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </nav>

            {/* Offline Status Badge */}
            <button
              id="btn-toggle-offline"
              onClick={onToggleOffline}
              title={isOffline ? 'Connected (Switch to Offline)' : 'Click to Toggle Offline Simulation'}
              className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-[#111111]">
                {isOffline ? 'Offline Mode Active' : 'Satellite Sync Active'}
              </span>
            </button>

            {/* Sound Chime Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={handleChimeTest}
              title={soundEnabled ? 'Railway Station Chime Enabled' : 'Enable Chimes'}
              className={`p-2 rounded-full border transition-all ${
                soundEnabled 
                  ? 'bg-blue-50 border-[#003399]/30 text-[#003399] hover:bg-blue-100' 
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Concourse Board Modal */}
            <button
              id="btn-open-station-board"
              onClick={onOpenStationBoard}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-[#003399] hover:text-white border border-slate-200 text-[#111111] transition-all"
              title="Station LED Concourse Board"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Concourse</span>
            </button>

            {/* Offline & 139 SMS Hub */}
            <button
              id="btn-open-offline-manager"
              onClick={onOpenOfflineManager}
              className="relative hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-[#003399] hover:text-white border border-slate-200 text-[#111111] transition-all"
              title="Offline Saved Journeys & 139 SMS Inquiry"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>SMS 139</span>
              {activeSavedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#003399] text-[9px] font-black text-white flex items-center justify-center">
                  {activeSavedCount}
                </span>
              )}
            </button>

            {/* Arrival Alerts Button */}
            <button
              id="btn-open-alerts-manager"
              onClick={onOpenAlertsManager}
              className="relative p-2 text-[#111111] hover:text-[#003399] rounded-full hover:bg-slate-100 transition-colors"
              title="Station Arrival Notifications"
            >
              <BellRing className="w-5 h-5 stroke-[2.2]" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
            </button>

            {/* Control Room Trigger */}
            <button
              id="btn-open-control-room"
              onClick={onOpenControlRoom}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#003399] text-white hover:bg-[#002266] shadow-sm transition-all"
              title="SIH 2026 Observability & Scenario Simulator"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Control Room</span>
            </button>

            {/* All Languages Dropdown */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 absolute left-2.5 text-slate-500 pointer-events-none" />
              <select
                id="language-select"
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="pl-7 pr-2.5 py-1.5 bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-full text-xs font-bold uppercase tracking-wider text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#003399] cursor-pointer"
                aria-label="Select Language"
              >
                {(Object.keys(languageNames) as LanguageCode[]).map((code) => (
                  <option key={code} value={code} className="bg-white text-[#111111] font-sans">
                    {languageNames[code].native} ({code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
