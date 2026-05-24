const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default || require('pixelmatch');

const cloneLabel = process.argv[2] || 'clone-contact-v3';
const VIEWS = ['desktop-1440', 'tablet-768', 'mobile-390'];
const PAIRS = [
  { label: 'scroll-0', suffix: '00' },
  { label: 'scroll-100vh', suffix: '01' },
];
const TH = 8;

let fails = 0;
let total = 0;
let sum = 0;

for (const v of VIEWS) {
  for (const { label, suffix } of PAIRS) {
    const file = `contact-scroll-${suffix}.png`;
    const clone = path.join(__dirname, '..', '_qa', cloneLabel, v, file);
    const live = path.join(__dirname, '..', '_qa', 'live-inner-v2', v, file);
    if (!fs.existsSync(clone) || !fs.existsSync(live)) {
      console.log(v, label, 'SKIP missing');
      continue;
    }
    const a = PNG.sync.read(fs.readFileSync(clone));
    const b = PNG.sync.read(fs.readFileSync(live));
    const w = Math.min(a.width, b.width);
    const h = Math.min(a.height, b.height);
    const diff = new PNG({ width: w, height: h });
    const mm = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.15 });
    const pct = Number(((mm / (w * h)) * 100).toFixed(2));
    total += 1;
    sum += pct;
    if (pct > TH) fails += 1;
    console.log(`${v} ${label}: ${pct}% ${pct <= TH ? 'PASS' : 'FAIL'}`);
  }
}

if (total) {
  console.log(`\nContact: ${total - fails}/${total} PASS, avg ${(sum / total).toFixed(2)}%`);
}
