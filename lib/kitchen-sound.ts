let ctx: AudioContext | null = null;

function getContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return ctx;
}

export function unlockKitchenSound() {
  const audioCtx = getContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

export function playNewOrderChime() {
  const audioCtx = getContext();
  if (audioCtx.state === "suspended") audioCtx.resume();

  const now = audioCtx.currentTime;
  const notes = [880, 1175]; // two-tone chime (A5 -> D6)

  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;

    const start = now + i * 0.14;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + 0.34);
  });
}
