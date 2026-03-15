const audioCtxRef: { current: AudioContext | null } = { current: null };

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtxRef.current) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    audioCtxRef.current = new AC();
  }
  return audioCtxRef.current;
}

export function playConfirmSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Two-tone ascending chime
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(880, now);
  osc1.connect(gain);
  osc1.start(now);
  osc1.stop(now + 0.15);

  const gain2 = ctx.createGain();
  gain2.connect(ctx.destination);
  gain2.gain.setValueAtTime(0.12, now + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1320, now + 0.1);
  osc2.connect(gain2);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.4);
}
