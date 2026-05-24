/**
 * Compare hero QA screenshots (clone-hero vs live-hero).
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default || require('pixelmatch');

const QA_DIR = path.join(__dirname, '..', '_qa');
const CLONE_DIR = path.join(QA_DIR, 'clone-hero');
const LIVE_DIR = path.join(QA_DIR, 'live-hero');
const DIFF_DIR = path.join(QA_DIR, 'diff-hero');
const THRESHOLD = 0.15;
const MAX_DIFF_PERCENT = 8;

const VIEWPORTS = [
  'mobile-390',
  'mobile-440',
  'tablet-768',
  'tablet-1024',
  'desktop-1440',
];

function readPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

function comparePair(clonePath, livePath, diffPath) {
  if (!fs.existsSync(clonePath) || !fs.existsSync(livePath)) {
    return { skip: true, reason: 'missing file' };
  }
  const img1 = readPng(clonePath);
  const img2 = readPng(livePath);
  const width = Math.min(img1.width, img2.width);
  const height = Math.min(img1.height, img2.height);
  const a = new PNG({ width, height });
  const b = new PNG({ width, height });
  const diff = new PNG({ width, height });
  PNG.bitblt(img1, a, 0, 0, width, height, 0, 0);
  PNG.bitblt(img2, b, 0, 0, width, height, 0, 0);
  const mismatched = pixelmatch(a.data, b.data, diff.data, width, height, {
    threshold: THRESHOLD,
  });
  fs.mkdirSync(path.dirname(diffPath), { recursive: true });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  const percent = (mismatched / (width * height)) * 100;
  return {
    skip: false,
    percent: Number(percent.toFixed(2)),
    pass: percent <= MAX_DIFF_PERCENT,
  };
}

function main() {
  const rows = [];
  for (const viewport of VIEWPORTS) {
    for (let i = 0; i < 4; i += 1) {
      const file = `home-scroll-${String(i).padStart(2, '0')}.png`;
      const scrollLabel = ['0vh', '100vh', '150vh', '250vh'][i];
      const result = comparePair(
        path.join(CLONE_DIR, viewport, file),
        path.join(LIVE_DIR, viewport, file),
        path.join(DIFF_DIR, viewport, file)
      );
      if (result.skip) continue;
      rows.push({ viewport, file, scroll: scrollLabel, ...result });
    }
  }
  rows.sort((a, b) => b.percent - a.percent);
  const report = {
    methodology: 'vh-scroll (0, 100vh, 150vh, 250vh), post-intro, fonts+video ready, DPR=1',
    compared: rows.length,
    failures: rows.filter((r) => !r.pass).length,
    thresholdPercent: MAX_DIFF_PERCENT,
    capturedAt: new Date().toISOString(),
    heroFrames: {
      '0vh': rows.filter((r) => r.scroll === '0vh'),
      '100vh': rows.filter((r) => r.scroll === '100vh'),
      '150vh': rows.filter((r) => r.scroll === '150vh'),
      '250vh': rows.filter((r) => r.scroll === '250vh'),
    },
    all: rows,
  };
  fs.writeFileSync(path.join(QA_DIR, 'hero-compare-report.json'), JSON.stringify(report, null, 2));
  console.log(`Compared ${report.compared} pairs, failures: ${report.failures}`);
  rows.forEach((r) => {
    console.log(`  [${r.pass ? 'OK' : 'FAIL'}] ${r.viewport} ${r.scroll} — ${r.percent}%`);
  });
}

main();
