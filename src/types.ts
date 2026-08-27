export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'kn';

export interface StationStop {
  stationCode: string;
  stationName: string;
  stationNameLocal?: Record<LanguageCode, string>;
  scheduledArrival: string; // "HH:MM" or "SOURCE"
  scheduledDeparture: string; // "HH:MM" or "DEST"
  distanceKm: number;
  platform: number;
  scheduledPlatform: number;
  isPlatformChanged?: boolean;
  platformChangeReason?: string;
  hasWaterFacility?: boolean;
  hasCatering?: boolean;
  haltMinutes: number;
}

export type SignalAspect = 'CLEAR_GREEN' | 'ATTENTION_DOUBLE_YELLOW' | 'CAUTION_YELLOW' | 'STOP_RED';

export type WeatherCondition = 'CLEAR' | 'FOG' | 'HEAVY_RAIN' | 'THUNDERSTORM' | 'HIGH_TEMPERATURE';

export interface ExplainabilityFactor {
  id: string;
  category: 'SIGNAL' | 'CONGESTION' | 'WEATHER' | 'SPEED_RESTRICTION' | 'PRECEDING_TRAIN' | 'MAINTENANCE' | 'STATION_DWELL';
  impactMinutes: number; // e.g. +14 mins delay, or -4 mins recovery
  description: string;
  descriptionLocal?: Record<LanguageCode, string>;
  severity: 'low' | 'medium' | 'high';
  locationSection?: string;
}

export interface DynamicETA {
  predictedArrival: string; // "HH:MM"
  predictedDeparture: string; // "HH:MM"
  delayMinutes: number; // positive is late, negative is before time
  confidenceScore: number; // 0 to 100%
  predictionIntervalMin: string; // "HH:MM" (lower bound)
  predictionIntervalMax: string; // "HH:MM" (upper bound)
  status: 'ON_TIME' | 'SLIGHT_DELAY' | 'DELAYED' | 'BEFORE_TIME' | 'DEPARTED' | 'ARRIVED';
  explainability: ExplainabilityFactor[];
}

export interface LiveTrainState {
  trainNumber: string;
  trainName: string;
  trainType: 'RAJวางHANI' | 'VANDE_BHARAT' | 'SHATABDI' | 'SUPERFAST' | 'MAIL_EXPRESS' | 'JAN_SHATABDI';
  zone: string; // e.g., "NR", "WR", "ER", "SR", "CR"
  sourceStation: string;
  destStation: string;
  currentKm: number;
  totalKm: number;
  currentSpeedKmH: number;
  maxSpeedKmH: number;
  currentStationIndex: number; // last station departed or currently at
  isAtStation: boolean;
  lastUpdated: string; // ISO string
  signalAspect: SignalAspect;
  weather: WeatherCondition;
  trackSection: string;
  precedingTrainGapKm: number;
  temporarySpeedRestrictionKmH?: number;
  stops: (StationStop & { eta: DynamicETA })[];
  isOfflineCached?: boolean;
}

export interface NotificationRule {
  id: string;
  trainNumber: string;
  stationCode: string;
  stationName: string;
  notifyMinutesBefore: number;
  platformChangeAlert: boolean;
  wakeUpAlarm: boolean;
  isEnabled: boolean;
  createdAt: number;
}

export interface ZonalMetric {
  zoneCode: string;
  zoneName: string;
  activeTrains: number;
  mlForecastMAE: number; // Mean Absolute Error in minutes (e.g., 2.8 min)
  staticScheduleMAE: number; // Static baseline MAE (e.g., 18.4 min)
  accuracyImprovementPct: number; // e.g., 84.7%
  dataFeedHealth: {
    gps: number; // 0-100%
    coa: number;
    tms: number;
    smms: number;
    weather: number;
  };
}

export interface StationConcourseArrival {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  scheduledTime: string;
  dynamicETA: string;
  delayMinutes: number;
  platform: number;
  scheduledPlatform: number;
  status: string;
  statusType: 'ontime' | 'delayed' | 'early' | 'platform_change';
}
