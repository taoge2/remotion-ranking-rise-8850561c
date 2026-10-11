/** Original 8-second instrumental score and motion sound design. No external samples. */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sr = 48000,
  duration = 8,
  length = sr * duration;
const music = [new Float64Array(length), new Float64Array(length)];
const motion = [new Float64Array(length), new Float64Array(length)];
const freq = (midi) => 440 * 2 ** ((midi - 69) / 12);
let seed = 20261011;
const noise = () => {
  seed = (1664525 * seed + 1013904223) >>> 0;
  return seed / 2147483648 - 1;
};
const smooth = (x) => {
  const v = Math.max(0, Math.min(1, x));
  return v * v * (3 - 2 * v);
};
const add = (track, i, sample, pan = 0) => {
  if (i < 0 || i >= length) return;
  track[0][i] += sample * Math.sqrt((1 - pan) / 2);
  track[1][i] += sample * Math.sqrt((1 + pan) / 2);
};
function pluck(start, midi, level = 0.12, pan = 0) {
  const f = freq(midi),
    begin = Math.round(start * sr);
  for (let j = 0; j < 1.55 * sr; j++) {
    const t = j / sr,
      attack = 1 - Math.exp(-t * 850),
      env = attack * Math.exp(-t * 5.3);
    const ph = 2 * Math.PI * f * t;
    const sample =
      (Math.sin(ph + 1.2 * Math.exp(-t * 10) * Math.sin(ph * 2)) +
        0.17 * Math.sin(ph * 2) +
        0.05 * Math.sin(ph * 3)) *
      env *
      level;
    add(music, begin + j, sample, pan);
    add(music, begin + j + Math.round(0.25 * sr), sample * 0.23, -pan);
    add(music, begin + j + Math.round(0.5 * sr), sample * 0.1, pan * 0.7);
  }
}
function pad(start, seconds, notes, level) {
  const begin = Math.round(start * sr);
  for (let j = 0; j < (seconds + 0.45) * sr; j++) {
    const t = j / sr,
      env = smooth(t / 0.38) * smooth((seconds + 0.45 - t) / 0.65);
    let l = 0,
      r = 0;
    for (const midi of notes) {
      const f = freq(midi);
      l +=
        Math.sin(2 * Math.PI * f * 0.9991 * t) +
        0.13 * Math.sin(2 * Math.PI * f * 2 * t);
      r +=
        Math.sin(2 * Math.PI * f * 1.0009 * t + 0.13) +
        0.13 * Math.sin(2 * Math.PI * f * 2 * t + 0.15);
    }
    const i = begin + j;
    if (i >= length) break;
    music[0][i] += ((l * level) / notes.length) * env;
    music[1][i] += ((r * level) / notes.length) * env;
  }
}
function bass(start, midi) {
  const begin = Math.round(start * sr),
    f = freq(midi);
  for (let j = 0; j < 0.46 * sr; j++) {
    const t = j / sr,
      env = smooth(t / 0.014) * Math.exp(-t * 6);
    add(
      music,
      begin + j,
      (Math.sin(2 * Math.PI * f * t) +
        0.12 * Math.sin(2 * Math.PI * f * 2 * t)) *
        0.12 *
        env,
    );
  }
}
function kick(start, level = 0.13) {
  const begin = Math.round(start * sr);
  for (let j = 0; j < 0.3 * sr; j++) {
    const t = j / sr,
      phase = 2 * Math.PI * (46 * t + 52 * 0.026 * (1 - Math.exp(-t / 0.026)));
    add(
      music,
      begin + j,
      Math.sin(phase) * Math.exp(-t * 19) * smooth(t / 0.004) * level,
    );
  }
}
function hat(start, level = 0.015, pan = 0.15) {
  const begin = Math.round(start * sr);
  let low = 0;
  for (let j = 0; j < 0.12 * sr; j++) {
    const t = j / sr,
      n = noise();
    low += 0.18 * (n - low);
    add(
      music,
      begin + j,
      (n - low) * Math.exp(-t * 55) * smooth(t / 0.002) * level,
      pan,
    );
  }
}
function tick(start, level = 0.014) {
  const begin = Math.round(start * sr);
  let low = 0;
  for (let j = 0; j < 0.18 * sr; j++) {
    const t = j / sr,
      n = noise();
    low += 0.27 * (n - low);
    const envelope =
      (Math.exp(-t * 38) + 0.3 * Math.exp(-Math.abs(t - 0.012) * 110)) *
      smooth(t / 0.003);
    add(music, begin + j, (n - low) * envelope * level, -0.12);
  }
}
function whoosh(start, seconds, level, panFrom = -0.25, panTo = 0.25) {
  const begin = Math.round(start * sr);
  let low = 0,
    slower = 0;
  for (let j = 0; j < seconds * sr; j++) {
    const t = j / sr,
      p = t / seconds,
      env = Math.sin(Math.PI * p) ** 2;
    const n = noise();
    low += (0.025 + 0.13 * Math.sin(Math.PI * p)) * (n - low);
    slower += 0.018 * (low - slower);
    const body = (low - slower) * 2.6;
    const shimmer = 0.035 * Math.sin(2 * Math.PI * (1050 * t + 160 * t * t));
    add(
      motion,
      begin + j,
      (body + shimmer) * env * level,
      panFrom + (panTo - panFrom) * p,
    );
  }
}
// Dmaj7 → Bm7 → Gmaj7 → D6, with a beat grid offset to the row transitions.
pad(0, 2.25, [50, 57, 61, 66], 0.115);
pad(2.1, 2.2, [47, 54, 57, 62], 0.105);
pad(4.1, 2.2, [43, 50, 54, 59], 0.105);
pad(6.1, 1.5, [50, 57, 59, 66], 0.12);
const melody = [69, 74, 78, 76, 78, 74, 73, 71, 71, 74, 78, 81, 78, 76, 74];
for (let n = 0; n < melody.length; n++) {
  const at = 0.4 + n * 0.5;
  pluck(
    at,
    melody[n],
    n === 5 || n === 14 ? 0.16 : 0.105,
    n % 2 === 0 ? -0.22 : 0.22,
  );
  if (n < 14) {
    hat(at, 0.014, 0.25);
    hat(at + 0.25, 0.01, -0.25);
    if (n % 2 === 0) {
      kick(at, n < 6 ? 0.13 : 0.1);
      bass(at, n < 4 ? 38 : n < 8 ? 35 : n < 12 ? 31 : 38);
    } else tick(at);
  }
}
// Airy sweeps follow the authored row movements and the final camera pullback.
whoosh(0, 0.38, 0.09);
whoosh(0.25, 0.6, 0.11);
whoosh(0.85, 0.5, 0.1);
whoosh(1.35, 0.55, 0.1);
whoosh(1.9, 0.5, 0.1);
whoosh(2.4, 0.5, 0.11);
whoosh(2.9, 0.4, 0.065);
whoosh(5.7, 1.7, 0.1, -0.35, 0.35);
// Small major-triad sparkle at the second-place arrival and the final still.
for (const at of [2.9, 7.4]) {
  for (const [n, midi] of [74, 78, 81].entries())
    pluck(at + n * 0.026, midi, 0.045, (n - 1) * 0.3);
}
// Gentle room reflection and a shared fade; no abrupt last sample.
for (const track of [music, motion])
  for (let i = length - 1; i >= Math.round(0.055 * sr); i--) {
    const j = i - Math.round(0.055 * sr);
    track[0][i] += track[1][j] * 0.055;
    track[1][i] += track[0][j] * 0.055;
  }
let peak = 0;
for (let i = 0; i < length; i++) {
  const t = i / sr,
    fade = smooth(t / 0.03) * smooth((duration - t) / 0.45);
  for (let c = 0; c < 2; c++) {
    music[c][i] *= fade;
    motion[c][i] *= fade;
    peak = Math.max(peak, Math.abs(music[c][i] + motion[c][i]));
  }
}
const gain = 10 ** (-2 / 20) / peak;
function writeWav(name, channels) {
  const out = Buffer.alloc(44 + length * 4);
  out.write("RIFF", 0);
  out.writeUInt32LE(out.length - 8, 4);
  out.write("WAVEfmt ", 8);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(2, 22);
  out.writeUInt32LE(sr, 24);
  out.writeUInt32LE(sr * 4, 28);
  out.writeUInt16LE(4, 32);
  out.writeUInt16LE(16, 34);
  out.write("data", 36);
  out.writeUInt32LE(length * 4, 40);
  for (let i = 0; i < length; i++)
    for (let c = 0; c < 2; c++)
      out.writeInt16LE(
        Math.round(Math.max(-1, Math.min(1, channels[c][i] * gain)) * 32767),
        44 + i * 4 + c * 2,
      );
  writeFileSync(resolve(root, "public/audio", name), out);
}
mkdirSync(resolve(root, "public/audio"), { recursive: true });
writeWav("smooth-score.wav", music);
writeWav("slide-sound-design.wav", motion);
writeWav("smooth-full-mix.wav", [
  music[0].map((v, i) => v + motion[0][i]),
  music[1].map((v, i) => v + motion[1][i]),
]);
console.log(
  "Generated original 120 BPM score and synchronized motion stems: 8 seconds, stereo 48 kHz, mix peak -2 dBFS.",
);
