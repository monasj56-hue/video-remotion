import fs from "fs";

fs.mkdirSync("public", { recursive: true });
const SR = 44100;

function simpan(nama, data) {
  const n = data.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, data[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.writeFileSync("public/" + nama + ".wav", buf);
}

function buat(durasi, fn) {
  const n = Math.floor(SR * durasi);
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = fn(i / SR, i / n);
  return a;
}

const TAU = Math.PI * 2;

let lp = 0;
simpan(
  "whoosh",
  buat(0.6, (t, p) => {
    const env = Math.sin(Math.PI * p);
    const c = 0.02 + 0.5 * p;
    lp += c * (Math.random() * 2 - 1 - lp);
    return lp * env * 2.5;
  })
);

simpan(
  "pop",
  buat(0.25, (t) => {
    const fase = 200 * t + (400 / 30) * (1 - Math.exp(-30 * t));
    return Math.sin(TAU * fase) * Math.exp(-t * 22);
  })
);

simpan(
  "hit",
  buat(0.45, (t) => {
    const fase = 45 * t + (90 / 12) * (1 - Math.exp(-12 * t));
    const badan = Math.sin(TAU * fase) * Math.exp(-t * 9);
    const derak = (Math.random() * 2 - 1) * Math.exp(-t * 60) * 0.5;
    return badan + derak;
  })
);

simpan(
  "ding",
  buat(1.2, (t) => {
    const serang = Math.min(1, t * 200);
    const nada =
      Math.sin(TAU * 1319 * t) * 0.6 +
      Math.sin(TAU * 1976 * t) * 0.25 +
      Math.sin(TAU * 2637 * t) * 0.1;
    return nada * Math.exp(-t * 4) * serang;
  })
);

console.log("SFX selesai dibuat");
