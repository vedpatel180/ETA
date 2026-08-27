import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  Clock, 
  Moon, 
  AlertTriangle, 
  Volume2, 
  Check, 
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { LiveTrainState, LanguageCode, NotificationRule } from '../types';
import { translations } from '../data/translations';
import { 
  requestNotificationPermission, 
  isNotificationGranted, 
  sendStationArrivalAlert,
  getSavedNotificationRules,
  saveNotificationRule,
  removeNotificationRule
} from '../utils/notifications';

interface ArrivalAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: LiveTrainState;
  selectedStationCode?: string;
  currentLang: LanguageCode;
}

export const ArrivalAlertsModal: React.FC<ArrivalAlertsModalProps> = ({
  isOpen,
  onClose,
  train,
  selectedStationCode,
  currentLang
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];
  const [stationCode, setStationCode] = useState<string>(selectedStationCode || train.destStation);
  const [notifyMinutesBefore, setNotifyMinutesBefore] = useState<number>(15);
  const [platformChangeAlert, setPlatformChangeAlert] = useState<boolean>(true);
  const [wakeUpAlarm, setWakeUpAlarm] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [activeRules, setActiveRules] = useState<NotificationRule[]>(getSavedNotificationRules());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setPermissionGranted(isNotificationGranted());
    if (selectedStationCode) {
      setStationCode(selectedStationCode);
    }
  }, [selectedStationCode]);

  const targetStop = train.stops.find(s => s.stationCode === stationCode) || train.stops[train.stops.length - 1];

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
  };

  const handleSaveRule = () => {
    const newRule = saveNotificationRule({
      trainNumber: train.trainNumber,
      stationCode: targetStop.stationCode,
      stationName: targetStop.stationName,
      notifyMinutesBefore,
      platformChangeAlert,
      wakeUpAlarm,
      isEnabled: true
    });
    setActiveRules(getSavedNotificationRules());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteRule = (id: string) => {
    removeNotificationRule(id);
    setActiveRules(getSavedNotificationRules());
  };

  const handleTestAlert = () => {
    sendStationArrivalAlert(
      train.trainName,
      targetStop.stationName,
      targetStop.eta.predictedArrival,
      targetStop.platform,
      wakeUpAlarm
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="alerts-modal-card"
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#003399]">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                PROXIMITY ALARMS & PUSH DISPATCH
              </h2>
              <h3 className="text-xl font-black uppercase text-[#111111]">
                {t.pushNotifications}
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

        {/* Permission Banner */}
        {!permissionGranted && (
          <div className="my-5 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-medium">
              <Bell className="w-4 h-4 text-[#003399] shrink-0" />
              <span>Enable browser push notifications to receive station arrival alerts in the background.</span>
            </div>
            <button
              onClick={handleRequestPermission}
              className="shrink-0 px-4 py-2 rounded-full bg-[#003399] hover:bg-[#002266] text-white font-black text-xs uppercase tracking-wider transition-colors"
            >
              Allow Alerts
            </button>
          </div>
        )}

        {/* Configuration Form */}
        <div className="space-y-4 my-5">
          
          {/* Target Station Select */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Select Destination Station
            </label>
            <select
              id="alert-station-select"
              value={stationCode}
              onChange={(e) => setStationCode(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-200 text-[#111111] text-sm font-bold focus:outline-none focus:border-[#003399]"
            >
              {train.stops.map((stop) => (
                <option key={stop.stationCode} value={stop.stationCode}>
                  {stop.stationName} ({stop.stationCode}) — ETA {stop.eta.predictedArrival} (PF {stop.platform})
                </option>
              ))}
            </select>
          </div>

          {/* Alert Time Buffer */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              {t.alertBeforeArrival}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setNotifyMinutesBefore(mins)}
                  className={`py-3 rounded-2xl text-xs font-mono font-black uppercase transition-all ${
                    notifyMinutesBefore === mins
                      ? 'bg-[#003399] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {mins}m Before
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-2.5 pt-2">
            
            {/* Platform Change Alert */}
            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-900 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-[#111111] block">Platform Change Alerts</span>
                  <span className="text-xs text-slate-500 font-medium">Instantly notify if train platform changes before arrival</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={platformChangeAlert}
                onChange={(e) => setPlatformChangeAlert(e.target.checked)}
                className="w-5 h-5 rounded text-[#003399] focus:ring-[#003399] border-slate-300 cursor-pointer"
              />
            </label>

            {/* Night Wake-Up Alarm */}
            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-900 mt-0.5">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-[#111111] block">Night Station Wake-Up Alarm</span>
                  <span className="text-xs text-slate-500 font-medium">Loud audio wake-up chime & high-intensity alarm before deboarding</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={wakeUpAlarm}
                onChange={(e) => setWakeUpAlarm(e.target.checked)}
                className="w-5 h-5 rounded text-[#003399] focus:ring-[#003399] border-slate-300 cursor-pointer"
              />
            </label>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <button
              onClick={handleTestAlert}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition-colors"
            >
              <Volume2 className="w-4 h-4 text-[#003399]" />
              <span>{t.testNotification}</span>
            </button>

            <button
              id="btn-confirm-save-rule"
              onClick={handleSaveRule}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#003399] text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              <span>{savedSuccess ? 'Alert Armed!' : 'Arm Arrival Alarm'}</span>
            </button>
          </div>

        </div>

        {/* Existing Active Rules */}
        {activeRules.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Active Station Watchers ({activeRules.length})
            </h4>
            {activeRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#003399]">{rule.stationCode}</span>
                    <span className="text-xs font-black uppercase text-[#111111]">{rule.stationName}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">({rule.notifyMinutesBefore}m buffer)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 font-medium">
                    Train {rule.trainNumber} {rule.wakeUpAlarm ? '• 🌙 Wake-Up Alarm' : ''} {rule.platformChangeAlert ? '• ⚡ Platform Alerts' : ''}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Delete alarm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
