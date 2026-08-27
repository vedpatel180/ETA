import { NotificationRule, LiveTrainState } from '../types';
import { playRailwayChime, playArrivalAlarm, playPlatformChangeTone } from './audioChime';

export interface InAppToast {
  id: string;
  title: string;
  body: string;
  type: 'arrival' | 'platform' | 'delay' | 'info';
  timestamp: string;
}

type ToastListener = (toast: InAppToast) => void;
const toastListeners: Set<ToastListener> = new Set();

export function subscribeToToasts(callback: ToastListener): () => void {
  toastListeners.add(callback);
  return () => toastListeners.delete(callback);
}

export function emitToast(toast: Omit<InAppToast, 'id' | 'timestamp'>) {
  const fullToast: InAppToast = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...toast
  };
  // Asynchronous dispatch to avoid React "Cannot update a component while rendering a different component"
  setTimeout(() => {
    toastListeners.forEach(listener => {
      try {
        listener(fullToast);
      } catch (err) {
        console.error('Toast listener error:', err);
      }
    });
  }, 0);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }
  return false;
}

export function isNotificationGranted(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  return Notification.permission === 'granted';
}

/**
 * Trigger Station Arrival Alert with sound, vibration, and push notification
 */
export function sendStationArrivalAlert(
  trainName: string,
  stationName: string,
  dynamicETA: string,
  platform: number,
  isWakeUp: boolean = false
) {
  const title = isWakeUp ? `🔔 WAKE UP! Arriving at ${stationName}` : `🚂 Train Arriving: ${stationName}`;
  const body = `${trainName} expected at Platform ${platform} at ${dynamicETA}. Please gather your luggage.`;

  // 1. Play synthesized train chime or wake up alarm
  if (isWakeUp) {
    playArrivalAlarm();
  } else {
    playRailwayChime();
  }

  // 2. Vibrate mobile device if available
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([300, 150, 300, 150, 500]);
  }

  // 3. Trigger Browser Web Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: `arrival-${stationName}`,
      });
    } catch (err) {
      console.warn('Native notification error:', err);
    }
  }

  // 4. Emit in-app banner toast
  emitToast({
    title,
    body,
    type: 'arrival'
  });
}

/**
 * Trigger Platform Change Alert
 */
export function sendPlatformChangeAlert(
  trainName: string,
  stationName: string,
  newPlatform: number,
  oldPlatform: number,
  reason?: string
) {
  const title = `⚠️ Platform Changed: ${stationName}`;
  const body = `${trainName} has been shifted from PF ${oldPlatform} ➔ Platform ${newPlatform}! ${reason ? `(${reason})` : ''}`;

  playPlatformChangeTone();

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: `platform-${stationName}`,
      });
    } catch (err) {
      console.warn('Native notification error:', err);
    }
  }

  emitToast({
    title,
    body,
    type: 'platform'
  });
}

// Local storage key for notification rules
const NOTIFICATION_RULES_KEY = 'raileta_notification_rules';

export function getSavedNotificationRules(): NotificationRule[] {
  try {
    const raw = localStorage.getItem(NOTIFICATION_RULES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveNotificationRule(rule: Omit<NotificationRule, 'id' | 'createdAt'>): NotificationRule {
  const current = getSavedNotificationRules();
  const newRule: NotificationRule = {
    ...rule,
    id: 'rule-' + Math.random().toString(36).substring(2, 9),
    createdAt: Date.now()
  };
  const updated = [...current.filter(r => !(r.trainNumber === rule.trainNumber && r.stationCode === rule.stationCode)), newRule];
  localStorage.setItem(NOTIFICATION_RULES_KEY, JSON.stringify(updated));
  return newRule;
}

export function removeNotificationRule(id: string): void {
  const current = getSavedNotificationRules();
  const filtered = current.filter(r => r.id !== id);
  localStorage.setItem(NOTIFICATION_RULES_KEY, JSON.stringify(filtered));
}
