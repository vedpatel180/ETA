import { LiveTrainState, StationConcourseArrival, ZonalMetric } from '../types';

export const INITIAL_TRAINS: LiveTrainState[] = [
  {
    trainNumber: '12951',
    trainName: 'Mumbai Central - New Delhi Tejas Rajdhani Express',
    trainType: 'RAJวางHANI',
    zone: 'WR',
    sourceStation: 'MMCT',
    destStation: 'NDLS',
    currentKm: 785,
    totalKm: 1384,
    currentSpeedKmH: 124,
    maxSpeedKmH: 130,
    currentStationIndex: 3,
    isAtStation: false,
    lastUpdated: new Date().toISOString(),
    signalAspect: 'CLEAR_GREEN',
    weather: 'CLEAR',
    trackSection: 'Ratlam - Kota Section (Nagda Jn Curve)',
    precedingTrainGapKm: 14.2,
    stops: [
      {
        stationCode: 'MMCT',
        stationName: 'Mumbai Central',
        stationNameLocal: {
          en: 'Mumbai Central',
          hi: 'मुंबई सेंट्रल',
          bn: 'মুম্বাই সেন্ট্রাল',
          ta: 'மும்பை சென்ட்ரல்',
          te: 'ముంబై సెంట్రల్',
          mr: 'मुंबई सेंट्रल',
          gu: 'મુંબઈ સેન્ટ્રલ',
          kn: 'ಮುಂಬೈ ಸೆಂಟ್ರಲ್'
        },
        scheduledArrival: 'SOURCE',
        scheduledDeparture: '17:00',
        distanceKm: 0,
        platform: 1,
        scheduledPlatform: 1,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 0,
        eta: {
          predictedArrival: 'SOURCE',
          predictedDeparture: '17:00',
          delayMinutes: 0,
          confidenceScore: 99,
          predictionIntervalMin: '17:00',
          predictionIntervalMax: '17:00',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'ST',
        stationName: 'Surat',
        stationNameLocal: {
          en: 'Surat',
          hi: 'सूरत',
          bn: 'সুরাট',
          ta: 'சூரத்',
          te: 'సూరత్',
          mr: 'सुरत',
          gu: 'સુરત',
          kn: 'ಸೂರತ್'
        },
        scheduledArrival: '19:43',
        scheduledDeparture: '19:48',
        distanceKm: 263,
        platform: 1,
        scheduledPlatform: 1,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 5,
        eta: {
          predictedArrival: '19:41',
          predictedDeparture: '19:47',
          delayMinutes: -2,
          confidenceScore: 98,
          predictionIntervalMin: '19:40',
          predictionIntervalMax: '19:44',
          status: 'DEPARTED',
          explainability: [
            {
              id: 'st-clear',
              category: 'SIGNAL',
              impactMinutes: -2,
              description: 'Clear automatic signalling corridor across Vadodara Division',
              severity: 'low'
            }
          ]
        }
      },
      {
        stationCode: 'BRC',
        stationName: 'Vadodara Junction',
        stationNameLocal: {
          en: 'Vadodara Junction',
          hi: 'वडोदरा जंक्शन',
          bn: 'ভদোদরা জংশন',
          ta: 'வதோதரா சந்திப்பு',
          te: 'వడోదర జంక్షన్',
          mr: 'वडोदरा जंक्शन',
          gu: 'વડોદરા જંકશન',
          kn: 'ವಡೋದರಾ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '21:06',
        scheduledDeparture: '21:16',
        distanceKm: 392,
        platform: 2,
        scheduledPlatform: 2,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 10,
        eta: {
          predictedArrival: '21:05',
          predictedDeparture: '21:15',
          delayMinutes: -1,
          confidenceScore: 97,
          predictionIntervalMin: '21:03',
          predictionIntervalMax: '21:08',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'RTM',
        stationName: 'Ratlam Junction',
        stationNameLocal: {
          en: 'Ratlam Junction',
          hi: 'रतलाम जंक्शन',
          bn: 'রৎলাম জংশন',
          ta: 'ரத்லாம் சந்திப்பு',
          te: 'రత్లాం జంక్షన్',
          mr: 'रतलाम जंक्शन',
          gu: 'રતલામ જંકશન',
          kn: 'ರತ್ಲಾಂ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '00:15',
        scheduledDeparture: '00:18',
        distanceKm: 653,
        platform: 4,
        scheduledPlatform: 4,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 3,
        eta: {
          predictedArrival: '00:14',
          predictedDeparture: '00:18',
          delayMinutes: 0,
          confidenceScore: 96,
          predictionIntervalMin: '00:12',
          predictionIntervalMax: '00:18',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'KOTA',
        stationName: 'Kota Junction',
        stationNameLocal: {
          en: 'Kota Junction',
          hi: 'कोटा जंक्शन',
          bn: 'কোটা জংশন',
          ta: 'கோட்டா சந்திப்பு',
          te: 'కోటా జంక్షన్',
          mr: 'कोटा जंक्शन',
          gu: 'કોટા જંકશન',
          kn: 'ಕೋಟಾ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '03:15',
        scheduledDeparture: '03:20',
        distanceKm: 920,
        platform: 1,
        scheduledPlatform: 1,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 5,
        eta: {
          predictedArrival: '03:22',
          predictedDeparture: '03:27',
          delayMinutes: 7,
          confidenceScore: 92,
          predictionIntervalMin: '03:19',
          predictionIntervalMax: '03:26',
          status: 'SLIGHT_DELAY',
          explainability: [
            {
              id: 'f1',
              category: 'CONGESTION',
              impactMinutes: 5,
              description: 'Sectional freight congestion cleared at Shamgarh outer loop',
              severity: 'medium',
              locationSection: 'Shamgarh - Ramganj Mandi'
            },
            {
              id: 'f2',
              category: 'SPEED_RESTRICTION',
              impactMinutes: 2,
              description: 'Temporary Caution Order (60 km/h) on Chambal Bridge approach',
              severity: 'low',
              locationSection: 'Darrah Pass'
            }
          ]
        }
      },
      {
        stationCode: 'MTJ',
        stationName: 'Mathura Junction',
        stationNameLocal: {
          en: 'Mathura Junction',
          hi: 'मथुरा जंक्शन',
          bn: 'মথুরা জংশন',
          ta: 'மதுரா சந்திப்பு',
          te: 'మథుర జంక్షన్',
          mr: 'मथुरा जंक्शन',
          gu: 'મથુરા જંકશન',
          kn: 'ಮಥುರಾ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '06:53',
        scheduledDeparture: '06:55',
        distanceKm: 1243,
        platform: 3,
        scheduledPlatform: 3,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 2,
        eta: {
          predictedArrival: '06:58',
          predictedDeparture: '07:00',
          delayMinutes: 5,
          confidenceScore: 90,
          predictionIntervalMin: '06:54',
          predictionIntervalMax: '07:04',
          status: 'SLIGHT_DELAY',
          explainability: [
            {
              id: 'f3',
              category: 'WEATHER',
              impactMinutes: 3,
              description: 'Early morning light fog in Yamuna basin corridor',
              severity: 'low'
            }
          ]
        }
      },
      {
        stationCode: 'NDLS',
        stationName: 'New Delhi',
        stationNameLocal: {
          en: 'New Delhi',
          hi: 'नई दिल्ली',
          bn: 'নতুন দিল্লি',
          ta: 'புது தில்லி',
          te: 'న్యూ ఢిల్లీ',
          mr: 'नवी दिल्ली',
          gu: 'નવી દિલ્હી',
          kn: 'ಹೊಸ ದೆಹಲಿ'
        },
        scheduledArrival: '08:32',
        scheduledDeparture: 'DEST',
        distanceKm: 1384,
        platform: 1,
        scheduledPlatform: 1,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 0,
        eta: {
          predictedArrival: '08:35',
          predictedDeparture: 'DEST',
          delayMinutes: 3,
          confidenceScore: 94,
          predictionIntervalMin: '08:31',
          predictionIntervalMax: '08:40',
          status: 'ON_TIME',
          explainability: [
            {
              id: 'f4',
              category: 'PRECEDING_TRAIN',
              impactMinutes: 2,
              description: 'Automatic precedence clearance at Tuglakabad yard entry',
              severity: 'low'
            }
          ]
        }
      }
    ]
  },
  {
    trainNumber: '22436',
    trainName: 'New Delhi - Varanasi Vande Bharat Express',
    trainType: 'VANDE_BHARAT',
    zone: 'NR',
    sourceStation: 'NDLS',
    destStation: 'BSB',
    currentKm: 340,
    totalKm: 759,
    currentSpeedKmH: 130,
    maxSpeedKmH: 160,
    currentStationIndex: 1,
    isAtStation: false,
    lastUpdated: new Date().toISOString(),
    signalAspect: 'CLEAR_GREEN',
    weather: 'CLEAR',
    trackSection: 'Kanpur Central approach high-speed chord',
    precedingTrainGapKm: 22.8,
    stops: [
      {
        stationCode: 'NDLS',
        stationName: 'New Delhi',
        stationNameLocal: {
          en: 'New Delhi',
          hi: 'नई दिल्ली',
          bn: 'নতুন দিল্লি',
          ta: 'புது தில்லி',
          te: 'న్యూ ఢిల్లీ',
          mr: 'नवी दिल्ली',
          gu: 'નવી દિલ્હી',
          kn: 'ಹೊಸ ದೆಹಲಿ'
        },
        scheduledArrival: 'SOURCE',
        scheduledDeparture: '06:00',
        distanceKm: 0,
        platform: 16,
        scheduledPlatform: 16,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 0,
        eta: {
          predictedArrival: 'SOURCE',
          predictedDeparture: '06:00',
          delayMinutes: 0,
          confidenceScore: 99,
          predictionIntervalMin: '06:00',
          predictionIntervalMax: '06:00',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'CNB',
        stationName: 'Kanpur Central',
        stationNameLocal: {
          en: 'Kanpur Central',
          hi: 'कानपुर सेंट्रल',
          bn: 'কানপুর সেন্ট্রাল',
          ta: 'கான்பூர் சென்ட்ரல்',
          te: 'కాన్పూర్ సెంట్రల్',
          mr: 'कानपूर सेंट्रल',
          gu: 'કાનપુર સેન્ટ્રલ',
          kn: 'ಕಾನ್ಪುರ ಸೆಂಟ್ರಲ್'
        },
        scheduledArrival: '10:08',
        scheduledDeparture: '10:10',
        distanceKm: 440,
        platform: 1,
        scheduledPlatform: 1,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 2,
        eta: {
          predictedArrival: '10:06',
          predictedDeparture: '10:09',
          delayMinutes: -2,
          confidenceScore: 96,
          predictionIntervalMin: '10:04',
          predictionIntervalMax: '10:08',
          status: 'BEFORE_TIME',
          explainability: [
            {
              id: 'vb-speed',
              category: 'SIGNAL',
              impactMinutes: -2,
              description: 'Vande Bharat priority path clearance with Kavach ATP active',
              severity: 'low'
            }
          ]
        }
      },
      {
        stationCode: 'PRYJ',
        stationName: 'Prayagraj Junction',
        stationNameLocal: {
          en: 'Prayagraj Junction',
          hi: 'प्रयागराज जंक्शन',
          bn: 'প্রয়াগরাজ জংশন',
          ta: 'பிரயாக்ராஜ் சந்திப்பு',
          te: 'ప్రయాగ్‌రాజ్ జంక్షన్',
          mr: 'प्रयागराज जंक्शन',
          gu: 'પ્રયાગરાજ જંકશન',
          kn: 'ಪ್ರಯಾಗ್‌ರಾಜ್ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '12:08',
        scheduledDeparture: '12:10',
        distanceKm: 635,
        platform: 6,
        scheduledPlatform: 2,
        isPlatformChanged: true,
        platformChangeReason: 'Platform 2 track maintenance clearance. Reassigned to Platform 6 with escalator access.',
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 2,
        eta: {
          predictedArrival: '12:09',
          predictedDeparture: '12:11',
          delayMinutes: 1,
          confidenceScore: 95,
          predictionIntervalMin: '12:07',
          predictionIntervalMax: '12:12',
          status: 'ON_TIME',
          explainability: [
            {
              id: 'vb-pf',
              category: 'MAINTENANCE',
              impactMinutes: 1,
              description: 'Platform 6 crossover turnout speed lock (30 km/h)',
              severity: 'low'
            }
          ]
        }
      },
      {
        stationCode: 'BSB',
        stationName: 'Varanasi Junction',
        stationNameLocal: {
          en: 'Varanasi Junction',
          hi: 'वाराणसी जंक्शन',
          bn: 'বারাণসী জংশন',
          ta: 'வாரணாசி சந்திப்பு',
          te: 'వారణాసి జంక్షన్',
          mr: 'वाराणसी जंक्शन',
          gu: 'વારાણસી જંકશન',
          kn: 'ವಾರಣಾಸಿ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '14:00',
        scheduledDeparture: 'DEST',
        distanceKm: 759,
        platform: 1,
        scheduledPlatform: 1,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 0,
        eta: {
          predictedArrival: '13:58',
          predictedDeparture: 'DEST',
          delayMinutes: -2,
          confidenceScore: 97,
          predictionIntervalMin: '13:55',
          predictionIntervalMax: '14:02',
          status: 'BEFORE_TIME',
          explainability: []
        }
      }
    ]
  },
  {
    trainNumber: '12301',
    trainName: 'Howrah - New Delhi Rajdhani Express (via Gaya)',
    trainType: 'RAJวางHANI',
    zone: 'ER',
    sourceStation: 'HWH',
    destStation: 'NDLS',
    currentKm: 560,
    totalKm: 1451,
    currentSpeedKmH: 110,
    maxSpeedKmH: 130,
    currentStationIndex: 2,
    isAtStation: false,
    lastUpdated: new Date().toISOString(),
    signalAspect: 'CAUTION_YELLOW',
    weather: 'FOG',
    trackSection: 'Gaya - Pt. Deen Dayal Upadhyaya Grand Chord',
    precedingTrainGapKm: 6.8,
    stops: [
      {
        stationCode: 'HWH',
        stationName: 'Howrah Junction',
        stationNameLocal: {
          en: 'Howrah Junction',
          hi: 'हावड़ा जंक्शन',
          bn: 'হাওড়া জংশন',
          ta: 'ஹவுரா சந்திப்பு',
          te: 'హౌరా జంక్షన్',
          mr: 'हावडा जंक्शन',
          gu: 'હાવડા જંકશન',
          kn: 'ಹೌರಾ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: 'SOURCE',
        scheduledDeparture: '16:50',
        distanceKm: 0,
        platform: 9,
        scheduledPlatform: 9,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 0,
        eta: {
          predictedArrival: 'SOURCE',
          predictedDeparture: '16:50',
          delayMinutes: 0,
          confidenceScore: 99,
          predictionIntervalMin: '16:50',
          predictionIntervalMax: '16:50',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'ASN',
        stationName: 'Asansol Junction',
        stationNameLocal: {
          en: 'Asansol Junction',
          hi: 'आसनसोल जंक्शन',
          bn: 'আসানসোল জংশন',
          ta: 'அசன்சோல் சந்திப்பு',
          te: 'అసన్సోల్ జంక్షన్',
          mr: 'आसनसोल जंक्शन',
          gu: 'આસનસોલ જંકશન',
          kn: 'ಅಸನ್ಸೋಲ್ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '18:57',
        scheduledDeparture: '19:00',
        distanceKm: 200,
        platform: 4,
        scheduledPlatform: 4,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 3,
        eta: {
          predictedArrival: '18:59',
          predictedDeparture: '19:02',
          delayMinutes: 2,
          confidenceScore: 97,
          predictionIntervalMin: '18:57',
          predictionIntervalMax: '19:03',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'DHN',
        stationName: 'Dhanbad Junction',
        stationNameLocal: {
          en: 'Dhanbad Junction',
          hi: 'धनबाद जंक्शन',
          bn: 'ধানবাদ জংশন',
          ta: 'தன்பாத் சந்திப்பு',
          te: 'ధన్‌బాద్ జంక్షన్',
          mr: 'धनबाद जंक्शन',
          gu: 'ધનબાદ જંકશન',
          kn: 'ಧನ್ಬಾದ್ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '19:55',
        scheduledDeparture: '20:00',
        distanceKm: 259,
        platform: 2,
        scheduledPlatform: 2,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 5,
        eta: {
          predictedArrival: '20:01',
          predictedDeparture: '20:06',
          delayMinutes: 6,
          confidenceScore: 95,
          predictionIntervalMin: '19:58',
          predictionIntervalMax: '20:07',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'GAYA',
        stationName: 'Gaya Junction',
        stationNameLocal: {
          en: 'Gaya Junction',
          hi: 'गया जंक्शन',
          bn: 'গয়া জংশন',
          ta: 'கயா சந்திப்பு',
          te: 'గయ జంక్షన్',
          mr: 'गया जंक्शन',
          gu: 'ગયા જંકશન',
          kn: 'ಗಯಾ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '22:19',
        scheduledDeparture: '22:22',
        distanceKm: 459,
        platform: 1,
        scheduledPlatform: 1,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 3,
        eta: {
          predictedArrival: '22:37',
          predictedDeparture: '22:40',
          delayMinutes: 18,
          confidenceScore: 89,
          predictionIntervalMin: '22:32',
          predictionIntervalMax: '22:43',
          status: 'DELAYED',
          explainability: [
            {
              id: 'hwh-fog',
              category: 'WEATHER',
              impactMinutes: 11,
              description: 'Moderate dense fog (Visibility < 200m) reducing train speed to 75 km/h on Koderma Ghat section',
              severity: 'high',
              locationSection: 'Koderma - Gurpa Ghat'
            },
            {
              id: 'hwh-prec',
              category: 'PRECEDING_TRAIN',
              impactMinutes: 7,
              description: 'Trailing 12313 Sealdah Rajdhani clearing block section ahead',
              severity: 'medium'
            }
          ]
        }
      },
      {
        stationCode: 'DDU',
        stationName: 'Pt. Deen Dayal Upadhyaya Junction',
        stationNameLocal: {
          en: 'Pt. DD Upadhyaya Jn',
          hi: 'पं. दीन दयाल उपाध्याय जं.',
          bn: 'দীন দয়াল উপাধ্যায় জংশন',
          ta: 'தீன் தயாள் உபாத்யாயா சந்திப்பு',
          te: 'దీన్ దయాల్ ఉపాధ్యాయ జంక్షన్',
          mr: 'पं. दीन दयाल उपाध्याय जं.',
          gu: 'પં. દીન દયાળ ઉપાધ્યાય જં.',
          kn: 'ದೀನ್ ದಯಾಳ್ ಉಪಾಧ್ಯಾಯ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '00:45',
        scheduledDeparture: '00:55',
        distanceKm: 664,
        platform: 3,
        scheduledPlatform: 1,
        isPlatformChanged: true,
        platformChangeReason: 'Platform 1 occupied by delayed goods rake. Shifted to Platform 3.',
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 10,
        eta: {
          predictedArrival: '01:09',
          predictedDeparture: '01:19',
          delayMinutes: 24,
          confidenceScore: 87,
          predictionIntervalMin: '01:02',
          predictionIntervalMax: '01:16',
          status: 'DELAYED',
          explainability: [
            {
              id: 'hwh-yard',
              category: 'CONGESTION',
              impactMinutes: 12,
              description: 'High traffic density at DDU yard interlocking bottleneck',
              severity: 'high'
            }
          ]
        }
      },
      {
        stationCode: 'PRYJ',
        stationName: 'Prayagraj Junction',
        stationNameLocal: {
          en: 'Prayagraj Junction',
          hi: 'प्रयागराज जंक्शन',
          bn: 'প্রয়াগরাজ জংশন',
          ta: 'பிரயாக்ராஜ் சந்திப்பு',
          te: 'ప్రయాగ్‌రాజ్ జంక్షన్',
          mr: 'प्रयागराज जंक्शन',
          gu: 'પ્રયાગરાજ જંકશન',
          kn: 'ಪ್ರಯಾಗ್‌ರಾಜ್ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '02:33',
        scheduledDeparture: '02:35',
        distanceKm: 817,
        platform: 1,
        scheduledPlatform: 1,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 2,
        eta: {
          predictedArrival: '02:54',
          predictedDeparture: '02:56',
          delayMinutes: 21,
          confidenceScore: 88,
          predictionIntervalMin: '02:48',
          predictionIntervalMax: '03:01',
          status: 'DELAYED',
          explainability: [
            {
              id: 'hwh-rec',
              category: 'SIGNAL',
              impactMinutes: -3,
              description: 'Sectional recovery time margin factored by Dynamic ML model',
              severity: 'low'
            }
          ]
        }
      },
      {
        stationCode: 'CNB',
        stationName: 'Kanpur Central',
        stationNameLocal: {
          en: 'Kanpur Central',
          hi: 'कानपुर सेंट्रल',
          bn: 'কানপুর সেন্ট্রাল',
          ta: 'கான்பூர் சென்ட்ரல்',
          te: 'కాన్పూర్ సెంట్రల్',
          mr: 'कानपूर सेंट्रल',
          gu: 'કાનપુર સેન્ટ્રલ',
          kn: 'ಕಾನ್ಪುರ ಸೆಂಟ್ರಲ್'
        },
        scheduledArrival: '04:40',
        scheduledDeparture: '04:45',
        distanceKm: 1012,
        platform: 2,
        scheduledPlatform: 2,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 5,
        eta: {
          predictedArrival: '04:58',
          predictedDeparture: '05:03',
          delayMinutes: 18,
          confidenceScore: 89,
          predictionIntervalMin: '04:51',
          predictionIntervalMax: '05:05',
          status: 'DELAYED',
          explainability: []
        }
      },
      {
        stationCode: 'NDLS',
        stationName: 'New Delhi',
        stationNameLocal: {
          en: 'New Delhi',
          hi: 'नई दिल्ली',
          bn: 'নতুন দিল্লি',
          ta: 'புது தில்லி',
          te: 'న్యూ ఢిల్లీ',
          mr: 'नवी दिल्ली',
          gu: 'નવી દિલ્હી',
          kn: 'ಹೊಸ ದೆಹಲಿ'
        },
        scheduledArrival: '10:05',
        scheduledDeparture: 'DEST',
        distanceKm: 1451,
        platform: 4,
        scheduledPlatform: 4,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 0,
        eta: {
          predictedArrival: '10:19',
          predictedDeparture: 'DEST',
          delayMinutes: 14,
          confidenceScore: 91,
          predictionIntervalMin: '10:12',
          predictionIntervalMax: '10:27',
          status: 'SLIGHT_DELAY',
          explainability: [
            {
              id: 'hwh-dest',
              category: 'SPEED_RESTRICTION',
              impactMinutes: -4,
              description: 'Dynamic ML algorithm predicts 4 min recovery in 130 km/h Ghaziabad-NDLS stretch',
              severity: 'low'
            }
          ]
        }
      }
    ]
  },
  {
    trainNumber: '12004',
    trainName: 'New Delhi - Lucknow Jn Swarna Shatabdi Express',
    trainType: 'SHATABDI',
    zone: 'NR',
    sourceStation: 'NDLS',
    destStation: 'LJN',
    currentKm: 198,
    totalKm: 512,
    currentSpeedKmH: 120,
    maxSpeedKmH: 130,
    currentStationIndex: 2,
    isAtStation: false,
    lastUpdated: new Date().toISOString(),
    signalAspect: 'CLEAR_GREEN',
    weather: 'CLEAR',
    trackSection: 'Aligarh - Tundla Section',
    precedingTrainGapKm: 18.5,
    stops: [
      {
        stationCode: 'NDLS',
        stationName: 'New Delhi',
        stationNameLocal: {
          en: 'New Delhi',
          hi: 'नई दिल्ली',
          bn: 'নতুন দিল্লি',
          ta: 'புது தில்லி',
          te: 'న్యూ ఢిల్లీ',
          mr: 'नवी दिल्ली',
          gu: 'નવી દિલ્હી',
          kn: 'ಹೊಸ ದೆಹಲಿ'
        },
        scheduledArrival: 'SOURCE',
        scheduledDeparture: '06:10',
        distanceKm: 0,
        platform: 12,
        scheduledPlatform: 12,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 0,
        eta: {
          predictedArrival: 'SOURCE',
          predictedDeparture: '06:10',
          delayMinutes: 0,
          confidenceScore: 99,
          predictionIntervalMin: '06:10',
          predictionIntervalMax: '06:10',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'GZB',
        stationName: 'Ghaziabad Junction',
        stationNameLocal: {
          en: 'Ghaziabad Junction',
          hi: 'गाजियाबाद जंक्शन',
          bn: 'গাজিয়াবাদ জংশন',
          ta: 'காசியாபாத் சந்திப்பு',
          te: 'ఘజియాబాద్ జంక్షన్',
          mr: 'गाझियाबाद जंक्शन',
          gu: 'ગાઝિયાબાદ જંકશન',
          kn: 'ಘಾಜಿಯಾಬಾದ್ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '06:48',
        scheduledDeparture: '06:50',
        distanceKm: 25,
        platform: 2,
        scheduledPlatform: 2,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 2,
        eta: {
          predictedArrival: '06:49',
          predictedDeparture: '06:51',
          delayMinutes: 1,
          confidenceScore: 98,
          predictionIntervalMin: '06:48',
          predictionIntervalMax: '06:52',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'ALJN',
        stationName: 'Aligarh Junction',
        stationNameLocal: {
          en: 'Aligarh Junction',
          hi: 'अलीगढ़ जंक्शन',
          bn: 'আলিগড় জংশন',
          ta: 'அலிகார் சந்திப்பு',
          te: 'అలీగఢ్ జంక్షన్',
          mr: 'अलिगड जंक्शन',
          gu: 'અલીગઢ જંકશન',
          kn: 'ಅಲಿಗಢ್ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '07:47',
        scheduledDeparture: '07:49',
        distanceKm: 131,
        platform: 3,
        scheduledPlatform: 3,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 2,
        eta: {
          predictedArrival: '07:48',
          predictedDeparture: '07:50',
          delayMinutes: 1,
          confidenceScore: 97,
          predictionIntervalMin: '07:47',
          predictionIntervalMax: '07:51',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'TDL',
        stationName: 'Tundla Junction',
        stationNameLocal: {
          en: 'Tundla Junction',
          hi: 'टूंडला जंक्शन',
          bn: 'তুন্ডলা জংশন',
          ta: 'துண்ட்லா சந்திப்பு',
          te: 'తుండ్ల జంక్షన్',
          mr: 'तुंडला जंक्शन',
          gu: 'ટુંડલા જંકશન',
          kn: 'ತುಂಡ್ಲಾ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '08:45',
        scheduledDeparture: '08:47',
        distanceKm: 209,
        platform: 4,
        scheduledPlatform: 4,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 2,
        eta: {
          predictedArrival: '08:46',
          predictedDeparture: '08:48',
          delayMinutes: 1,
          confidenceScore: 96,
          predictionIntervalMin: '08:44',
          predictionIntervalMax: '08:49',
          status: 'ON_TIME',
          explainability: []
        }
      },
      {
        stationCode: 'CNB',
        stationName: 'Kanpur Central',
        stationNameLocal: {
          en: 'Kanpur Central',
          hi: 'कानपुर सेंट्रल',
          bn: 'কানপুর সেন্ট্রাল',
          ta: 'கான்பூர் சென்ட்ரல்',
          te: 'కాన్పూర్ సెంట్రల్',
          mr: 'कानपूर सेंट्रल',
          gu: 'કાનપુર સેન્ટ્રલ',
          kn: 'ಕಾನ್ಪುರ ಸೆಂಟ್ರಲ್'
        },
        scheduledArrival: '11:20',
        scheduledDeparture: '11:25',
        distanceKm: 439,
        platform: 5,
        scheduledPlatform: 5,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 5,
        eta: {
          predictedArrival: '11:22',
          predictedDeparture: '11:27',
          delayMinutes: 2,
          confidenceScore: 94,
          predictionIntervalMin: '11:19',
          predictionIntervalMax: '11:26',
          status: 'ON_TIME',
          explainability: []
        }
      },
      {
        stationCode: 'LJN',
        stationName: 'Lucknow Junction NER',
        stationNameLocal: {
          en: 'Lucknow Junction',
          hi: 'लखनऊ जंक्शन',
          bn: 'লখনউ জংশন',
          ta: 'லக்னோ சந்திப்பு',
          te: 'లక్నో జంక్షన్',
          mr: 'लखनौ जंक्शन',
          gu: 'લખનૌ જંકશન',
          kn: 'ಲಖನೌ ಜಂಕ್ಷನ್'
        },
        scheduledArrival: '12:40',
        scheduledDeparture: 'DEST',
        distanceKm: 512,
        platform: 6,
        scheduledPlatform: 6,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 0,
        eta: {
          predictedArrival: '12:42',
          predictedDeparture: 'DEST',
          delayMinutes: 2,
          confidenceScore: 95,
          predictionIntervalMin: '12:38',
          predictionIntervalMax: '12:46',
          status: 'ON_TIME',
          explainability: []
        }
      }
    ]
  },
  {
    trainNumber: '12626',
    trainName: 'New Delhi - Thiruvananthapuram Kerala Express',
    trainType: 'SUPERFAST',
    zone: 'SR',
    sourceStation: 'NDLS',
    destStation: 'TVC',
    currentKm: 1480,
    totalKm: 3031,
    currentSpeedKmH: 98,
    maxSpeedKmH: 110,
    currentStationIndex: 3,
    isAtStation: false,
    lastUpdated: new Date().toISOString(),
    signalAspect: 'ATTENTION_DOUBLE_YELLOW',
    weather: 'HEAVY_RAIN',
    trackSection: 'Warangal - Vijayawada South Central corridor',
    precedingTrainGapKm: 8.2,
    stops: [
      {
        stationCode: 'NDLS',
        stationName: 'New Delhi',
        scheduledArrival: 'SOURCE',
        scheduledDeparture: '20:10',
        distanceKm: 0,
        platform: 3,
        scheduledPlatform: 3,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 0,
        eta: {
          predictedArrival: 'SOURCE',
          predictedDeparture: '20:10',
          delayMinutes: 0,
          confidenceScore: 99,
          predictionIntervalMin: '20:10',
          predictionIntervalMax: '20:10',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'BPL',
        stationName: 'Bhopal Junction',
        scheduledArrival: '05:30',
        scheduledDeparture: '05:35',
        distanceKm: 701,
        platform: 1,
        scheduledPlatform: 1,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 5,
        eta: {
          predictedArrival: '05:42',
          predictedDeparture: '05:47',
          delayMinutes: 12,
          confidenceScore: 94,
          predictionIntervalMin: '05:38',
          predictionIntervalMax: '05:46',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'NGP',
        stationName: 'Nagpur Junction',
        scheduledArrival: '11:45',
        scheduledDeparture: '11:50',
        distanceKm: 1091,
        platform: 2,
        scheduledPlatform: 2,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 5,
        eta: {
          predictedArrival: '12:08',
          predictedDeparture: '12:13',
          delayMinutes: 23,
          confidenceScore: 91,
          predictionIntervalMin: '12:02',
          predictionIntervalMax: '12:15',
          status: 'DEPARTED',
          explainability: []
        }
      },
      {
        stationCode: 'BZA',
        stationName: 'Vijayawada Junction',
        scheduledArrival: '20:10',
        scheduledDeparture: '20:20',
        distanceKm: 1753,
        platform: 1,
        scheduledPlatform: 7,
        isPlatformChanged: true,
        platformChangeReason: 'Platform 7 under signal interlocking test. Train received on Main Platform 1.',
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 10,
        eta: {
          predictedArrival: '20:46',
          predictedDeparture: '20:56',
          delayMinutes: 36,
          confidenceScore: 86,
          predictionIntervalMin: '20:38',
          predictionIntervalMax: '20:54',
          status: 'DELAYED',
          explainability: [
            {
              id: 'ker-rain',
              category: 'WEATHER',
              impactMinutes: 18,
              description: 'Heavy torrential monsoon downpour & track water-level sensor restriction between Balharshah and Kazipet',
              severity: 'high'
            },
            {
              id: 'ker-casc',
              category: 'CONGESTION',
              impactMinutes: 15,
              description: 'Cascading delay from crossing 12621 Tamil Nadu Express at Balharshah bottleneck',
              severity: 'high'
            }
          ]
        }
      },
      {
        stationCode: 'MAS',
        stationName: 'Puratchi Thalaivar Dr. MGR Central (Chennai)',
        scheduledArrival: '03:15',
        scheduledDeparture: '03:30',
        distanceKm: 2184,
        platform: 5,
        scheduledPlatform: 5,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 15,
        eta: {
          predictedArrival: '03:44',
          predictedDeparture: '03:59',
          delayMinutes: 29,
          confidenceScore: 88,
          predictionIntervalMin: '03:35',
          predictionIntervalMax: '03:52',
          status: 'DELAYED',
          explainability: [
            {
              id: 'ker-rec-sr',
              category: 'SPEED_RESTRICTION',
              impactMinutes: -7,
              description: 'Southern Railway night green-wave corridor recovery (-7 mins)',
              severity: 'low'
            }
          ]
        }
      },
      {
        stationCode: 'ERS',
        stationName: 'Ernakulam Junction',
        scheduledArrival: '15:25',
        scheduledDeparture: '15:30',
        distanceKm: 2825,
        platform: 2,
        scheduledPlatform: 2,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 5,
        eta: {
          predictedArrival: '15:48',
          predictedDeparture: '15:53',
          delayMinutes: 23,
          confidenceScore: 87,
          predictionIntervalMin: '15:40',
          predictionIntervalMax: '15:57',
          status: 'DELAYED',
          explainability: []
        }
      },
      {
        stationCode: 'TVC',
        stationName: 'Thiruvananthapuram Central',
        scheduledArrival: '19:15',
        scheduledDeparture: 'DEST',
        distanceKm: 3031,
        platform: 1,
        scheduledPlatform: 1,
        isPlatformChanged: false,
        hasWaterFacility: true,
        hasCatering: true,
        haltMinutes: 0,
        eta: {
          predictedArrival: '19:33',
          predictedDeparture: 'DEST',
          delayMinutes: 18,
          confidenceScore: 90,
          predictionIntervalMin: '19:24',
          predictionIntervalMax: '19:42',
          status: 'SLIGHT_DELAY',
          explainability: [
            {
              id: 'ker-fin',
              category: 'CONGESTION',
              impactMinutes: -5,
              description: 'Terminal clearance priority scheduled by Thiruvananthapuram division control',
              severity: 'low'
            }
          ]
        }
      }
    ]
  }
];

export const ZONAL_METRICS: ZonalMetric[] = [
  {
    zoneCode: 'NR',
    zoneName: 'Northern Railway',
    activeTrains: 842,
    mlForecastMAE: 2.3, // 2.3 mins error
    staticScheduleMAE: 19.8, // 19.8 mins static error
    accuracyImprovementPct: 88.4,
    dataFeedHealth: { gps: 99.4, coa: 98.7, tms: 97.2, smms: 96.8, weather: 99.0 }
  },
  {
    zoneCode: 'WR',
    zoneName: 'Western Railway',
    activeTrains: 618,
    mlForecastMAE: 1.8,
    staticScheduleMAE: 14.5,
    accuracyImprovementPct: 87.6,
    dataFeedHealth: { gps: 99.8, coa: 99.2, tms: 98.5, smms: 99.1, weather: 99.5 }
  },
  {
    zoneCode: 'ER',
    zoneName: 'Eastern Railway',
    activeTrains: 532,
    mlForecastMAE: 3.1,
    staticScheduleMAE: 24.2,
    accuracyImprovementPct: 87.2,
    dataFeedHealth: { gps: 98.1, coa: 97.4, tms: 96.0, smms: 95.8, weather: 98.2 }
  },
  {
    zoneCode: 'SR',
    zoneName: 'Southern Railway',
    activeTrains: 580,
    mlForecastMAE: 2.0,
    staticScheduleMAE: 16.2,
    accuracyImprovementPct: 87.7,
    dataFeedHealth: { gps: 99.5, coa: 98.9, tms: 98.1, smms: 97.9, weather: 99.1 }
  },
  {
    zoneCode: 'CR',
    zoneName: 'Central Railway',
    activeTrains: 720,
    mlForecastMAE: 2.6,
    staticScheduleMAE: 21.0,
    accuracyImprovementPct: 87.6,
    dataFeedHealth: { gps: 99.1, coa: 98.3, tms: 97.8, smms: 97.0, weather: 98.9 }
  }
];

export const STATION_CONCOURSE_FEEDS: Record<string, StationConcourseArrival[]> = {
  NDLS: [
    {
      trainNumber: '12951',
      trainName: 'Tejas Rajdhani Express',
      source: 'MMCT (Mumbai Central)',
      destination: 'NDLS (New Delhi)',
      scheduledTime: '08:32',
      dynamicETA: '08:35',
      delayMinutes: 3,
      platform: 1,
      scheduledPlatform: 1,
      status: 'Approaching Shivaji Bridge (6 km)',
      statusType: 'ontime'
    },
    {
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      source: 'NDLS (New Delhi)',
      destination: 'BSB (Varanasi)',
      scheduledTime: '06:00',
      dynamicETA: '06:00',
      delayMinutes: 0,
      platform: 16,
      scheduledPlatform: 16,
      status: 'Departed On Time',
      statusType: 'ontime'
    },
    {
      trainNumber: '12301',
      trainName: 'Howrah Rajdhani Express',
      source: 'HWH (Howrah)',
      destination: 'NDLS (New Delhi)',
      scheduledTime: '10:05',
      dynamicETA: '10:19',
      delayMinutes: 14,
      platform: 4,
      scheduledPlatform: 4,
      status: 'Late 14 min - Approaching Anand Vihar',
      statusType: 'delayed'
    },
    {
      trainNumber: '12004',
      trainName: 'Swarna Shatabdi Express',
      source: 'NDLS (New Delhi)',
      destination: 'LJN (Lucknow)',
      scheduledTime: '06:10',
      dynamicETA: '06:10',
      delayMinutes: 0,
      platform: 12,
      scheduledPlatform: 12,
      status: 'Departed On Time',
      statusType: 'ontime'
    },
    {
      trainNumber: '12424',
      trainName: 'Dibrugarh Rajdhani Express',
      source: 'DBRG (Dibrugarh)',
      destination: 'NDLS (New Delhi)',
      scheduledTime: '10:10',
      dynamicETA: '10:45',
      delayMinutes: 35,
      platform: 9,
      scheduledPlatform: 2,
      status: 'Platform Changed to PF 9 (Late 35 min)',
      statusType: 'platform_change'
    }
  ],
  MMCT: [
    {
      trainNumber: '12952',
      trainName: 'Tejas Rajdhani Express',
      source: 'NDLS (New Delhi)',
      destination: 'MMCT (Mumbai Central)',
      scheduledTime: '08:35',
      dynamicETA: '08:32',
      delayMinutes: -3,
      platform: 1,
      scheduledPlatform: 1,
      status: 'Early by 3 min - Borivali passed',
      statusType: 'early'
    },
    {
      trainNumber: '20901',
      trainName: 'Gandhinagar Vande Bharat',
      source: 'MMCT (Mumbai)',
      destination: 'GNC (Gandhinagar)',
      scheduledTime: '06:00',
      dynamicETA: '06:00',
      delayMinutes: 0,
      platform: 5,
      scheduledPlatform: 5,
      status: 'Ready at Platform 5',
      statusType: 'ontime'
    },
    {
      trainNumber: '12953',
      trainName: 'August Kranti Rajdhani',
      source: 'MMCT (Mumbai)',
      destination: 'NZM (Hazrat Nizamuddin)',
      scheduledTime: '17:10',
      dynamicETA: '17:10',
      delayMinutes: 0,
      platform: 2,
      scheduledPlatform: 2,
      status: 'Scheduled',
      statusType: 'ontime'
    }
  ],
  CNB: [
    {
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      source: 'NDLS (New Delhi)',
      destination: 'BSB (Varanasi)',
      scheduledTime: '10:08',
      dynamicETA: '10:06',
      delayMinutes: -2,
      platform: 1,
      scheduledPlatform: 1,
      status: 'Approaching Panki (12 km) - 130 km/h',
      statusType: 'ontime'
    },
    {
      trainNumber: '12301',
      trainName: 'Howrah Rajdhani',
      source: 'HWH (Howrah)',
      destination: 'NDLS (New Delhi)',
      scheduledTime: '04:40',
      dynamicETA: '04:58',
      delayMinutes: 18,
      platform: 2,
      scheduledPlatform: 2,
      status: 'Late 18 min - Passing Fatehpur',
      statusType: 'delayed'
    },
    {
      trainNumber: '12004',
      trainName: 'Swarna Shatabdi Express',
      source: 'NDLS (New Delhi)',
      destination: 'LJN (Lucknow)',
      scheduledTime: '11:20',
      dynamicETA: '11:22',
      delayMinutes: 2,
      platform: 5,
      scheduledPlatform: 5,
      status: 'Right Time - Passing Rura',
      statusType: 'ontime'
    }
  ]
};
