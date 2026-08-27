import React, { useState } from 'react';
import { 
  Train, 
  Volume2, 
  VolumeX, 
  Globe, 
  Sliders, 
  Tv, 
  BellRing, 
  DownloadCloud,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations, languageNames } from '../data/translations';
import { playRailwayChime } from '../utils/audioChime';
import { useAuth } from '../context/AuthContext';

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
  const { user, profile, signOut } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'IR';
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-[#111111] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title - Bold Typography Signature */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 bg-[#003399] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-sm tracking-tight shrink-0">
              IR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] leading-tight block text-[#111111]">
                  Indian Railways
                </span>
                <span className="hidden sm:inline-block font-mono text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-50 text-[#003399] border border-blue-200">
                  SIH 2026
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#003399]">
                Live Dynamic Forecast
              </span>
            </div>
          </div>

          {/* Center / Right Nav Tools with Bold Typography */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Language Switcher */}
            <nav className="hidden xl:flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {quickLangs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => onLanguageChange(l.code)}
                  className={`transition-all pb-0.5 ${
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
              className="hidden sm:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-[#111111]">
                {isOffline ? 'Offline' : 'GPS Active'}
              </span>
            </button>

            {/* Sound Chime Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={handleChimeTest}
              title={soundEnabled ? 'Railway Station Chime Enabled' : 'Enable Chimes'}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
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
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-[#003399] hover:text-white border border-slate-200 text-[#111111] transition-all cursor-pointer"
              title="Station LED Concourse Board"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Concourse</span>
            </button>

            {/* Offline & 139 SMS Hub */}
            <button
              id="btn-open-offline-manager"
              onClick={onOpenOfflineManager}
              className="relative hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-[#003399] hover:text-white border border-slate-200 text-[#111111] transition-all cursor-pointer"
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
              className="relative p-2 text-[#111111] hover:text-[#003399] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Station Arrival Notifications"
            >
              <BellRing className="w-4 h-4 stroke-[2.2]" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full" />
            </button>

            {/* Control Room Trigger */}
            <button
              id="btn-open-control-room"
              onClick={onOpenControlRoom}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#003399] text-white hover:bg-[#002266] shadow-sm transition-all cursor-pointer"
              title="SIH 2026 Observability & Scenario Simulator"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Control Room</span>
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
                    {code.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* User Account / Profile & Sign Out */}
            {user && (
              <div className="relative">
                <button
                  id="user-profile-button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full transition-colors cursor-pointer"
                  title="View Account Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px] font-black tracking-tight">
                    {getInitials(profile?.displayName, user.email)}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-black text-[#111111] truncate max-w-[90px] leading-tight">
                      {profile?.displayName || 'Passenger'}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-slate-500 leading-none">
                      {profile?.role === 'railway_official' ? 'Official' : profile?.role === 'irctc_agent' ? 'IRCTC Agent' : 'Passenger'}
                    </span>
                  </div>
                </button>

                {/* Profile Popup Dropdown */}
                {profileDropdownOpen && (
                  <div 
                    id="profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 space-y-3"
                  >
                    <div className="border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#003399] text-white flex items-center justify-center font-black text-xs">
                          {getInitials(profile?.displayName, user.email)}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-black uppercase text-[#111111] truncate">
                            {profile?.displayName || 'Passenger'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate">
                            {user.email || 'Guest Session'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#003399] text-[10px] font-black uppercase">
                          {profile?.role === 'railway_official' ? 'Railway Official' : profile?.role === 'irctc_agent' ? 'IRCTC Agent' : 'Verified Passenger'}
                        </span>
                        {user.isAnonymous && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[9px] font-bold">
                            Guest
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs font-bold text-slate-600">
                      <div className="flex items-center justify-between py-1 text-slate-500">
                        <span>Database Sync:</span>
                        <span className="font-mono font-black text-green-700 text-[11px]">Firestore Online</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-slate-500">
                        <span>Saved Alarms:</span>
                        <span className="font-mono font-black text-[#111111]">{activeSavedCount}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-2">
                      <button
                        onClick={async () => {
                          setProfileDropdownOpen(false);
                          await signOut();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-red-50 text-red-600 hover:text-red-700 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

