import { LiveTrainState } from '../types';

const OFFLINE_TRAINS_KEY = 'raileta_cached_trains';
const LAST_ONLINE_TIME_KEY = 'raileta_last_online_time';

export function saveTrainForOffline(train: LiveTrainState): void {
  try {
    const existing = getOfflineTrains();
    const map = new Map(existing.map(t => [t.trainNumber, t]));
    map.set(train.trainNumber, {
      ...train,
      isOfflineCached: true,
      lastUpdated: new Date().toISOString()
    });
    localStorage.setItem(OFFLINE_TRAINS_KEY, JSON.stringify(Array.from(map.values())));
  } catch (e) {
    console.error('Failed to save train for offline:', e);
  }
}

export function getOfflineTrains(): LiveTrainState[] {
  try {
    const raw = localStorage.getItem(OFFLINE_TRAINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isTrainSavedOffline(trainNumber: string): boolean {
  const list = getOfflineTrains();
  return list.some(t => t.trainNumber === trainNumber);
}

export function removeOfflineTrain(trainNumber: string): void {
  const existing = getOfflineTrains();
  const filtered = existing.filter(t => t.trainNumber !== trainNumber);
  localStorage.setItem(OFFLINE_TRAINS_KEY, JSON.stringify(filtered));
}

/**
 * Generate official Indian Railways 139 SMS inquiry command
 * Standard format: SPOT <train_no> or TRAIN <train_no>
 */
export function generateSMSInquiry(trainNumber: string): { smsNumber: string; smsBody: string } {
  return {
    smsNumber: '139',
    smsBody: `SPOT ${trainNumber}`
  };
}

/**
 * Generate Platform SMS inquiry command
 */
export function generatePlatformSMS(trainNumber: string, stationCode: string): { smsNumber: string; smsBody: string } {
  return {
    smsNumber: '139',
    smsBody: `PF ${trainNumber} ${stationCode}`
  };
}
