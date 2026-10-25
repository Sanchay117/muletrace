import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SFX_DIR = path.join(ROOT, "public/sfx");
const MUSIC_DIR = path.join(ROOT, "public/music");
const SR = 48000;

function writeStereoWav(filePath: string, left: Float32Array, right: Float32Array) {
  const n = left.length;
  const dataBytes = n * 4;
  const buf = Buffer.alloc(44 + dataBytes);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataBytes, 40);
  let off = 44;
  for (let i = 0; i < n; i++) {
    const l = Math.max(-1, Math.min(1, left[i]));
    const r = Math.max(-1, Math.min(1, right[i]));
    buf.writeInt16LE(Math.round(l * 32767), off);
    buf.writeInt16LE(Math.round(r * 32767), off + 2);
    off += 4;
  }
  fs.writeFileSync(filePath, buf);
}

function makeSplitChime() {
  const n = Math.floor(SR * 0.45);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  const freqs = [587.33, 880.0, 1174.66];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 11);
    let s = 0;
    for (const f of freqs) s += Math.sin(2 * Math.PI * f * t);
    L[i] = s * 0.16 * env;
    R[i] = s * 0.16 * env * 0.94;
  }
  writeStereoWav(path.join(SFX_DIR, "split.wav"), L, R);
}

function makeSnipGate() {
  const n = Math.floor(SR * 0.32);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 24);
    const click = Math.sin(2 * Math.PI * (1420 - t * 2400) * t) + 0.5 * Math.sin(2 * Math.PI * 2650 * t);
    L[i] = click * 0.25 * env;
    R[i] = click * 0.23 * env;
  }
  writeStereoWav(path.join(SFX_DIR, "snip.wav"), L, R);
}

function makeZapShortcut() {
  const n = Math.floor(SR * 0.55);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.sin(Math.min(1, t / 0.04) * (Math.PI / 2)) * Math.exp(-t * 6.5);
    const f = 320 + t * 1150;
    const val = Math.sin(2 * Math.PI * f * t) * 0.22 * env;
    L[i] = val;
    R[i] = val * 1.05;
  }
  writeStereoWav(path.join(SFX_DIR, "zap.wav"), L, R);
}

function makeVaultLock() {
  const n = Math.floor(SR * 0.62);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const sub = Math.sin(2 * Math.PI * (96 * Math.exp(-t * 5)) * t) * Math.exp(-t * 7);
    const bolt = t > 0.06 ? Math.sin(2 * Math.PI * 784 * (t - 0.06)) * Math.exp(-(t - 0.06) * 14) : 0;
    const v = (sub * 0.42 + bolt * 0.22);
    L[i] = v;
    R[i] = v;
  }
  writeStereoWav(path.join(SFX_DIR, "vault.wav"), L, R);
}

function makeShutter() {
  const n = Math.floor(SR * 0.36);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  let state = 1234567;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    state = (1103515245 * state + 12345) & 0x7fffffff;
    const white = state / 0x7fffffff - 0.5;
    const env = Math.sin((t / 0.36) * Math.PI) * 0.14;
    const tone = Math.sin(2 * Math.PI * (220 + t * 260) * t) * 0.09;
    L[i] = (white * 0.35 + tone) * env;
    R[i] = (white * 0.32 + tone) * env;
  }
  writeStereoWav(path.join(SFX_DIR, "shutter.wav"), L, R);
}

function makeFinTechPulseBed() {
  // 195 seconds stereo D-Dorian precision analog pluck + warm sub pad (112 BPM)
  const dur = 195;
  const n = SR * dur;
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  const scale = [146.83, 174.61, 220.0, 261.63, 293.66, 329.63, 440.0, 293.66];
  const stepSec = 60 / 112 / 2;

  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const stepIdx = Math.floor(t / stepSec);
    const localT = t - stepIdx * stepSec;
    const f = scale[stepIdx % scale.length];
    const pluckEnv = Math.exp(-localT * 11.5);
    const pluck = Math.sin(2 * Math.PI * f * localT) * 0.065 * pluckEnv;
    const pad =
      (Math.sin(2 * Math.PI * 73.42 * t) * 0.045 +
        Math.sin(2 * Math.PI * 110.0 * t) * 0.032) *
      (0.85 + 0.15 * Math.sin(2 * Math.PI * 0.12 * t));
    const pan = 0.5 + 0.25 * Math.sin(stepIdx * 0.9);
    L[i] = pad + pluck * pan;
    R[i] = pad + pluck * (1 - pan);
  }
  writeStereoWav(path.join(MUSIC_DIR, "bed.wav"), L, R);
}

fs.mkdirSync(SFX_DIR, { recursive: true });
fs.mkdirSync(MUSIC_DIR, { recursive: true });
makeSplitChime();
makeSnipGate();
makeZapShortcut();
makeVaultLock();
makeShutter();
makeFinTechPulseBed();
console.log("Synthesized MuleTrace bespoke 48kHz stereo SFX & D-Dorian FinTech score.");
