const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default || require('pixelmatch');

const VIEWS = ['desktop-1440', 'tablet-768', 'mobile-390'];
const PAIRS = [
  { label: 'scroll-0', clone: '00', live: '00' },
  { label: 'scroll-100vh', clone: '02', live: '01' },
];
const TH = 8;

for (const v of VIEWS) {
  for (const { label, clone: cs, live: ls } of PAIRS) {
    const file = (suffix) => `realisations-scroll-${suffix}.png`;
    const v3 = path.join(__dirname, '..', '_qa', 'clone-realisations-v3', v, file(cs));
    const live = path.join(__dirname, '..', '_qa', 'live-inner-v2', v, file(ls));
    const old = path.join(
      __dirname,
      '..',
      '_qa',
      'clone-inner-v2',
      v,
      file(ls)
    );
    if (!fs.existsSync(v3) || !fs.existsSync(live)) {
      console.log(v, label, 'SKIP missing');
      continue;
    }
    const a = PNG.sync.read(fs.readFileSync(v3));
    const b = PNG.sync.read(fs.readFileSync(live));
    const w = Math.min(a.width, b.width);
    const h = Math.min(a.height, b.height);
    const diff = new PNG({ width: w, height: h });
    const mm = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.15 });
    const pct = Number(((mm / (w * h)) * 100).toFixed(2));
    let was = null;
    if (fs.existsSync(old)) {
      const c = PNG.sync.read(fs.readFileSync(old));
      const mm2 = pixelmatch(c.data, b.data, diff.data, w, h, { threshold: 0.15 });
      was = Number(((mm2 / (w * h)) * 100).toFixed(2));
    }
    console.log(
      `${v} ${label}: ${pct}% ${pct <= TH ? 'PASS' : 'FAIL'}${was != null ? ` (was ${was}%)` : ''}`
    );
  }
}
