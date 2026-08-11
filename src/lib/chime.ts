// Мягкий колокольчик через WebAudio — без внешних файлов
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function strike(audio: AudioContext, freq: number, at: number, gain: number) {
  const osc = audio.createOscillator();
  const env = audio.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0, at);
  env.gain.linearRampToValueAtTime(gain, at + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, at + 2.6);
  osc.connect(env);
  env.connect(audio.destination);
  osc.start(at);
  osc.stop(at + 2.8);
}

/** Проиграть колокольчик (два мягких удара) */
export function playChime() {
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime + 0.02;
  // основной тон + обертоны
  strike(audio, 880, now, 0.18);
  strike(audio, 1320, now, 0.07);
  strike(audio, 1760, now, 0.04);
  // второй удар
  strike(audio, 880, now + 0.55, 0.1);
  strike(audio, 1320, now + 0.55, 0.04);
}
