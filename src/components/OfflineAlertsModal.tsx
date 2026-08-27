import React, { useState } from 'react';
import { 
  X, 
  WifiOff, 
  MessageSquare, 
  Copy, 
  Check, 
  PhoneCall, 
  DownloadCloud, 
  Trash2, 
  Clock, 
  Train, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { LiveTrainState, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { getOfflineTrains, removeOfflineTrain, generateSMSInquiry, generatePlatformSMS } from '../utils/offlineStorage';

interface OfflineAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrain: LiveTrainState;
  onSelectTrain: (train: LiveTrainState) => void;
  currentLang: LanguageCode;
}

export const OfflineAlertsModal: React.FC<OfflineAlertsModalProps> = ({
  isOpen,
  onClose,
  currentTrain,
  onSelectTrain,
  currentLang
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [cachedTrains, setCachedTrains] = useState<LiveTrainState[]>(getOfflineTrains());

  const smsQuery = generateSMSInquiry(currentTrain.trainNumber);
  const pfQuery = generatePlatformSMS(currentTrain.trainNumber, currentTrain.destStation);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDeleteCache = (trainNumber: string) => {
    removeOfflineTrain(trainNumber);
    setCachedTrains(getOfflineTrains());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="offline-modal-card"
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                OFFLINE ENGINE & 139 SMS
              </h2>
              <h3 className="text-xl font-black uppercase text-[#111111]">
                {t.offlineStatus}
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

        {/* SMS 139 Section */}
        <div className="my-5 p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wide">
              <MessageSquare className="w-4 h-4 text-amber-700" />
              <span>{t.smsEnquiry} (Zero Internet)</span>
            </div>
            <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-300">
              TOLL-FREE 139
            </span>
          </div>

          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            {t.smsInstructions}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Live Spot SMS */}
            <div className="p-3.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-2 shadow-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Live Position SMS</span>
                <div className="font-mono text-sm font-black text-[#111111] mt-0.5">{smsQuery.smsBody}</div>
              </div>
              <button
                onClick={() => handleCopy(smsQuery.smsBody)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#111111] hover:bg-[#003399] text-white text-xs font-black uppercase tracking-wider transition-colors"
              >
                {copiedCode === smsQuery.smsBody ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === smsQuery.smsBody ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Platform SMS */}
            <div className="p-3.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-2 shadow-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Platform Check SMS</span>
                <div className="font-mono text-sm font-black text-[#111111] mt-0.5">{pfQuery.smsBody}</div>
              </div>
              <button
                onClick={() => handleCopy(pfQuery.smsBody)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-[#111111] text-xs font-black uppercase tracking-wider transition-colors"
              >
                {copiedCode === pfQuery.smsBody ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === pfQuery.smsBody ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Offline Cached Routes in Browser */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <DownloadCloud className="w-4 h-4 text-[#003399]" />
              <span>Offline Cached Journeys ({cachedTrains.length})</span>
            </h4>
          </div>

          {cachedTrains.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center font-medium">
              No trains saved for offline access yet. Click "Save Route Offline" on any train to cache full timetables.
            </div>
          ) : (
            <div className="space-y-2">
              {cachedTrains.map((ct) => (
                <div
                  key={ct.trainNumber}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div 
                    onClick={() => {
                      onSelectTrain(ct);
                      onClose();
                    }}
                    className="cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-white text-[#003399] border border-slate-200">
                        {ct.trainNumber}
                      </span>
                      <span className="text-xs font-black uppercase text-[#111111] truncate max-w-xs">
                        {ct.trainName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1 font-medium">
                      {ct.sourceStation} ➔ {ct.destStation} • {ct.stops.length} stations cached
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCache(ct.trainNumber)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Remove from offline cache"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Railway Helpline Numbers */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 mb-2">
            <PhoneCall className="w-4 h-4 text-[#003399]" />
            <span>Emergency Rail Assistance (Direct Dial)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <a
              href="tel:139"
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#003399] text-[#111111] font-bold flex items-center justify-between shadow-2xs"
            >
              <span>139 (All-in-One)</span>
              <ArrowRight className="w-3 h-3 text-[#003399]" />
            </a>
            <a
              href="tel:182"
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#003399] text-[#111111] font-bold flex items-center justify-between shadow-2xs"
            >
              <span>182 (Security)</span>
              <ArrowRight className="w-3 h-3 text-[#003399]" />
            </a>
            <a
              href="tel:112"
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#003399] text-[#111111] font-bold flex items-center justify-between shadow-2xs"
            >
              <span>112 (SOS)</span>
              <ArrowRight className="w-3 h-3 text-[#003399]" />
            </a>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#003399] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
