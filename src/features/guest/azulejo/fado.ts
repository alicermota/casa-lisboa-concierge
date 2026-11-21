/**
 * "fado for the road": an original, generated Portuguese-guitar style loop (no recordings, no copyright).
 * Plucked strings via Karplus–Strong, A minor fado progression (Am · Dm · E7 · Am), slow 3/4 sway.
 */
type Note = number; // frequency in Hz
const n = (semisFromA4: number): Note => 440 * Math.pow(2, semisFromA4 / 12);
// handy notes
const A2 = n(-24), D3 = n(-19), E2 = n(-29), C3 = n(-21), G2 = n(-26);
const A3 = n(-12), C4 = n(-9), E4 = n(-5), A4 = n(0), D4 = n(-7), F4 = n(-4), D5 = n(5);
const E3 = n(-17), GS3 = n(-13), B3 = n(-10), C5 = n(3), B4 = n(2), E5 = n(7), G4 = n(-2), F5 = n(8);

// bar = 6 eighths: [bass, arpeggio x5], plus an optional melody note on beat 1
const BARS: { bass: Note; arp: Note[]; mel?: Note }[] = [
  { bass: A2, arp: [A3, C4, E4, A4, E4], mel: E5 },
  { bass: A2, arp: [A3, C4, E4, C5, E4], mel: C5 },
  { bass: D3, arp: [D4, F4, A4, D5, A4], mel: F5 },
  { bass: D3, arp: [D4, F4, A4, F4, A4], mel: D5 },
  { bass: E2, arp: [E3, GS3, B3, D4, B3], mel: B4 },
  { bass: E2, arp: [E3, GS3, B3, E4, D4], mel: D5 },
  { bass: A2, arp: [A3, C4, E4, A4, E4], mel: C5 },
  { bass: C3, arp: [G2 * 2, C4, E4, G4, E4], mel: A4 },
];

export class FadoPlayer {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private cache = new Map<number, AudioBuffer>();
  private timer = 0;
  private nextTime = 0;
  private step = 0;
  playing = false;

  private pluck(freq: number, dur = 2.2): AudioBuffer {
    const key = Math.round(freq * 10);
    const hit = this.cache.get(key);
    if (hit) return hit;
    const ctx = this.ctx!;
    const sr = ctx.sampleRate;
    const period = Math.max(2, Math.round(sr / freq));
    const len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    const ring = new Float32Array(period);
    for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
    let idx = 0;
    const decay = 0.4985 + Math.min(0.0012, freq / 1e6); // slightly brighter strings ring a bit longer
    for (let i = 0; i < len; i++) {
      const cur = ring[idx]!;
      const nxt = ring[(idx + 1) % period]!;
      ring[idx] = decay * (cur + nxt);
      d[i] = cur;
      idx = (idx + 1) % period;
    }
    this.cache.set(key, buf);
    return buf;
  }

  private play(freq: number, at: number, gain: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.pluck(freq);
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(g).connect(this.out!);
    src.start(at);
  }

  private schedule = () => {
    const ctx = this.ctx!;
    const eighth = 60 / 76 / 2; // ~76 bpm, swaying 6/8
    while (this.nextTime < ctx.currentTime + 0.25) {
      const bar = BARS[Math.floor(this.step / 6) % BARS.length]!;
      const pos = this.step % 6;
      const swing = pos % 2 ? eighth * 0.08 : 0; // a touch of rubato
      const t = this.nextTime + swing;
      if (pos === 0) {
        this.play(bar.bass, t, 0.55);
        if (bar.mel && Math.floor(this.step / 6) % 2 === 0) this.play(bar.mel, t + 0.02, 0.32);
      } else {
        this.play(bar.arp[pos - 1]!, t, 0.26);
      }
      this.nextTime += eighth;
      this.step++;
    }
  };

  async start() {
    if (this.playing) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!this.ctx) {
      this.ctx = new AC();
      // warm, a little room: lowpass + simple feedback delay
      const lp = this.ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 3200;
      const master = this.ctx.createGain();
      master.gain.value = 0;
      const delay = this.ctx.createDelay();
      delay.delayTime.value = 0.23;
      const fb = this.ctx.createGain();
      fb.gain.value = 0.22;
      lp.connect(master);
      lp.connect(delay);
      delay.connect(fb).connect(delay);
      delay.connect(master);
      master.connect(this.ctx.destination);
      this.out = lp;
      (this as unknown as { master: GainNode }).master = master;
    }
    await this.ctx.resume();
    const master = (this as unknown as { master: GainNode }).master;
    master.gain.cancelScheduledValues(this.ctx.currentTime);
    master.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.4);
    this.nextTime = this.ctx.currentTime + 0.1;
    this.playing = true;
    this.timer = window.setInterval(this.schedule, 60);
    this.schedule();
  }

  stop() {
    if (!this.ctx || !this.playing) return;
    const master = (this as unknown as { master: GainNode }).master;
    master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
    window.clearInterval(this.timer);
    this.playing = false;
  }
}

let player: FadoPlayer | null = null;
export const fado = () => (player ??= new FadoPlayer());
