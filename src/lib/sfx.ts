// Apple-Pay-like success chime synthesized with Web Audio.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  const c = ctx!;
  if (c.state === "suspended") c.resume().catch(() => {});
  return c;
}


function tone(freq: number, start: number, dur: number, gain = 0.18, type: OscillatorType = "sine") {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function playPaySuccess() {
  // Short two-note ascending "ding-ding" chime, similar in spirit to the
  // Apple Pay / Apple Wallet confirmation sound (quick bright bell-like rise).
  tone(1108.7, 0, 0.14, 0.2); // C#6
  tone(1567.98, 0.09, 0.28, 0.22); // G6
}

export function playOrderArrived() {
  // Slightly fuller three-note chime for when the fake tracker reaches "Arrived".
  tone(784, 0, 0.12, 0.16); // G5
  tone(987.77, 0.1, 0.12, 0.18); // B5
  tone(1318.5, 0.2, 0.35, 0.2); // E6
}
