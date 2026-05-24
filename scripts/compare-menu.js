/**
 * Compare menu QA screenshots clone vs live.
 * Usage: node scripts/compare-menu.js [thresholdPercent]
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const THRESHOLD = Number(process.argv[2] || 8);
const ROOT = path.join(__dirname, '..', '_qa', 'menu');
const CLONE = path.join(ROOT, 'clone-menu');
const LIVE = path.join(ROOT, 'live-menu');
const OUT = path.join(ROOT, 'compare-report.json');

const VIEWPORTS = ['desktop-1440', 'tablet-768', 'mobile-390'];
const STATES = ['closed', 'open'];

function loadPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

function comparePair(cloneFile, liveFile) {
  if (!fs.existsSync(cloneFile) || !fs.existsSync(liveFile)) {
    return { pass: false, reason: 'missing file', cloneFile, liveFile };
  }
  const a = loadPng(cloneFile);
  const b = loadPng(liveFile);
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(a.data, b.data, diff.data, width, height, {
    threshold: 0.1,
    includeAA: false,
  });
  const total = width * height;
  const percent = (mismatched / total) * 100;
  return {
    pass: percent <= THRESHOLD,
    percent: Number(percent.toFixed(2)),
    width,
    height,
    mismatched,
    cloneFile,
    liveFile,
  };
}

function main() {
  const pairs = [];
  for (const viewport of VIEWPORTS) {
    for (const state of STATES) {
      const name = `menu-${state}.png`;
      pairs.push({
        viewport,
        state,
        ...comparePair(
          path.join(CLONE, viewport, name),
          path.join(LIVE, viewport, name)
        ),
      });
    }
  }

  const passed = pairs.filter((p) => p.pass).length;
  const report = {
    threshold: THRESHOLD,
    passed,
    total: pairs.length,
    avgPercent: Number(
      (pairs.reduce((s, p) => s + (p.percent || 100), 0) / pairs.length).toFixed(2)
    ),
    pairs,
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main();
