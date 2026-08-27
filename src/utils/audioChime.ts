/**
 * Web Audio API synthesizer for Authentic Indian Railways Station Announcement Chime & Alerts
 * No external audio files required - works 100% offline.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('AudioContext not available:', e);
    return null;
  }
}

/**
 * Classic Indian Railways 4-Tone Announcement Chime (Ding-Dong-Ding-Dong)
 * Notes: F4 (349.23 Hz), A4 (440 Hz), C5 (523.25 Hz), F5 (698.46 Hz)
 */
export function playRailwayChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [
    { freq: 440.0, time: 0.0, duration: 0.4 },   // A4
    { freq: 554.37, time: 0.35, duration: 0.4 },  // C#5
    { freq: 659.25, time: 0.7, duration: 0.5 },   // E5
    { freq: 880.0, time: 1.05, duration: 0.8 },   // A5
  ];

  const now = ctx.currentTime;

  notes.forEach(note => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, now + note.time);

    // Warm harmonics
    gain.gain.setValueAtTime(0.001, now + note.time);
    gain.gain.exponentialRampToValueAtTime(0.28, now + note.time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.time);
    osc.stop(now + note.time + note.duration);
  });
}

/**
 * Station Arrival Proximity Alarm Tone (Wake-up / Urgency chime)
 */
export function playArrivalAlarm(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now + i * 0.25); // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, now + i * 0.25 + 0.15); // A5

    gain.gain.setValueAtTime(0.01, now + i * 0.25);
    gain.gain.linearRampToValueAtTime(0.35, now + i * 0.25 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.25);
    osc.stop(now + i * 0.25 + 0.23);
  }
}

/**
 * Platform Change Alert (Noticeable two-tone warning)
 */
export function playPlatformChangeTone(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const tones = [
    { freq: 784, time: 0, dur: 0.18 }, // G5
    { freq: 523.25, time: 0.22, dur: 0.35 }, // C5
  ];

  tones.forEach(t => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(t.freq, now + t.time);

    gain.gain.setValueAtTime(0.01, now + t.time);
    gain.gain.linearRampToValueAtTime(0.3, now + t.time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + t.time + t.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + t.time);
    osc.stop(now + t.time + t.dur);
  });
}
