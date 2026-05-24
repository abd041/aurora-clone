/**
 * Pixel-diff clone vs live QA screenshots.
 *
 * Usage:
 *   node scripts/compare-qa.js --clone clone-inner-v2 --live live-inner-v2 --inner-only
 *   node scripts/compare-qa.js --clone clone-hero --live live-hero
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default || require('pixelmatch');

const QA_DIR = path.join(__dirname, '..', '_qa');
const THRESHOLD = 0.15;
const MAX_DIFF_PERCENT = 8;

const VIEWPORTS = [
  'mobile-390',
  'mobile-440',
  'tablet-768',
  'tablet-1024',
  'desktop-1440',
];

const INNER_ROUTES = new Set([
  'agence',
  'realisations',
  'realisation-detail',
  'contact',
  'nous-rejoindre',
]);

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    clone: 'clone-inner-v2',
    live: 'live-inner-v2',
    innerOnly: false,
    out: 'inner-compare-report.json',
  };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--clone') opts.clone = args[++i];
    if (args[i] === '--live') opts.live = args[++i];
    if (args[i] === '--inner-only') opts.innerOnly = true;
    if (args[i] === '--out') opts.out = args[++i];
  }
  return opts;
}

function readPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

function routeFromFile(file) {
  const m = file.match(/^(.+?)-scroll-/);
  return m ? m[1] : file.replace('.png', '');
}

function analyzeRegions(a, b, width, height) {
  const bands = [
    { name: 'top', y0: 0, y1: Math.floor(height / 3) },
    { name: 'middle', y0: Math.floor(height / 3), y1: Math.floor((height * 2) / 3) },
    { name: 'bottom', y0: Math.floor((height * 2) / 3), y1: height },
  ];

  return bands.map(({ name, y0, y1 }) => {
    const bandHeight = y1 - y0;
    const bandA = new PNG({ width, height: bandHeight });
    const bandB = new PNG({ width, height: bandHeight });
    const bandDiff = new PNG({ width, height: bandHeight });

    PNG.bitblt(a, bandA, 0, y0, width, bandHeight, 0, 0);
    PNG.bitblt(b, bandB, 0, y0, width, bandHeight, 0, 0);

    const mismatched = pixelmatch(
      bandA.data,
      bandB.data,
      bandDiff.data,
      width,
      bandHeight,
      { threshold: THRESHOLD }
    );

    return {
      region: name,
      percent: Number(((mismatched / (width * bandHeight)) * 100).toFixed(2)),
    };
  });
}

function classifyMismatch(percent, route, regions) {
  if (percent <= MAX_DIFF_PERCENT) {
    return 'acceptable production variance';
  }
  const worst = [...regions].sort((x, y) => y.percent - x.percent)[0];
  if (route === 'realisations' || route === 'realisation-detail') {
    if (worst.region === 'top' && percent > 20) {
      return 'scroll/compositor variance (parallax scrub timing)';
    }
    return 'rendering variance (gallery/slider parallax)';
  }
  if (route === 'contact' && worst.region === 'bottom') {
    return 'implementation issue (form/footer spacing)';
  }
  if (percent > 40) {
    return 'implementation issue (layout or typography drift)';
  }
  if (percent > 15) {
    return 'rendering variance (animation frame / font rasterization)';
  }
  return 'compositor variance';
}

function componentHint(route, regions) {
  const worst = [...regions].sort((x, y) => y.percent - x.percent)[0];
  const map = {
    agence: {
      top: 'AgenceHero, AgenceMarquee',
      middle: 'AgenceStats, AgenceDescription, AgenceCards',
      bottom: 'AgenceSplit, AgenceValeurs, ContactMap',
    },
    realisations: {
      top: 'RealisationsSlider (first item mask/entry)',
      middle: 'RealisationsSlider (parallax scrub)',
      bottom: 'RealisationsSlider (link/category)',
    },
    'realisation-detail': {
      top: 'RealisationHead, RealisationStats',
      middle: 'RealisationPlayer, RealisationGallery',
      bottom: 'RealisationSimilaires',
    },
    contact: {
      top: 'ContactForm (.contact-left parallax, RevealLines title)',
      middle: 'ContactForm (fieldset layout)',
      bottom: 'DoubleMarquee, ContactMap, ImagesTrail',
    },
    'nous-rejoindre': {
      top: 'JoinHero (video-mask scrub)',
      middle: 'RejoindreOffres',
      bottom: 'RejoindreOffres, footer',
    },
  };
  return map[route]?.[worst.region] || `${route} / ${worst.region}`;
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

  const mismatched = pixelmatch(
    a.data,
    b.data,
    diff.data,
    width,
    height,
    { threshold: THRESHOLD }
  );

  fs.mkdirSync(path.dirname(diffPath), { recursive: true });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const total = width * height;
  const percent = (mismatched / total) * 100;
  const regions = analyzeRegions(a, b, width, height);
  const route = routeFromFile(path.basename(clonePath));

  return {
    skip: false,
    route,
    width,
    height,
    mismatched,
    percent: Number(percent.toFixed(2)),
    pass: percent <= MAX_DIFF_PERCENT,
    regions,
    worstRegion: [...regions].sort((x, y) => y.percent - x.percent)[0],
    classification: classifyMismatch(percent, route, regions),
    components: componentHint(route, regions),
  };
}

function collectFiles(dir, viewport) {
  const vpDir = path.join(dir, viewport);
  if (!fs.existsSync(vpDir)) return [];
  return fs
    .readdirSync(vpDir)
    .filter((f) => f.endsWith('.png'))
    .sort();
}

function aggregateByRoute(rows) {
  const byRoute = {};
  for (const row of rows) {
    if (!byRoute[row.route]) {
      byRoute[row.route] = { percents: [], failures: 0, count: 0 };
    }
    byRoute[row.route].percents.push(row.percent);
    byRoute[row.route].count += 1;
    if (!row.pass) byRoute[row.route].failures += 1;
  }

  return Object.entries(byRoute)
    .map(([route, data]) => ({
      route,
      pairs: data.count,
      failures: data.failures,
      avgPercent: Number(
        (data.percents.reduce((s, p) => s + p, 0) / data.percents.length).toFixed(2)
      ),
      maxPercent: Math.max(...data.percents),
    }))
    .sort((a, b) => b.maxPercent - a.maxPercent);
}

function main() {
  const opts = parseArgs();
  const diffDir = path.join(QA_DIR, `diff-${opts.clone}-vs-${opts.live}`);
  const rows = [];
  let failures = 0;
  let compared = 0;
  let skipped = 0;

  for (const viewport of VIEWPORTS) {
    const files = collectFiles(path.join(QA_DIR, opts.clone), viewport);
    for (const file of files) {
      const route = routeFromFile(file);
      if (opts.innerOnly && !INNER_ROUTES.has(route)) continue;

      const clonePath = path.join(QA_DIR, opts.clone, viewport, file);
      const livePath = path.join(QA_DIR, opts.live, viewport, file);
      const diffPath = path.join(diffDir, viewport, file);
      const result = comparePair(clonePath, livePath, diffPath);

      if (result.skip) {
        skipped += 1;
        continue;
      }

      compared += 1;
      rows.push({ viewport, file, ...result });
      if (!result.pass) failures += 1;
    }
  }

  rows.sort((a, b) => b.percent - a.percent);
  const byRoute = aggregateByRoute(rows);

  const report = {
    methodology: 'deterministic vh-scroll + intro skip + frame sync (visual-qa.js)',
    cloneLabel: opts.clone,
    liveLabel: opts.live,
    innerOnly: opts.innerOnly,
    compared,
    skipped,
    failures,
    thresholdPercent: MAX_DIFF_PERCENT,
    byRoute,
    worst: rows.slice(0, 20),
    all: rows,
  };

  fs.mkdirSync(QA_DIR, { recursive: true });
  const reportPath = path.join(QA_DIR, opts.out);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`Compared ${compared} pairs (${opts.clone} vs ${opts.live})`);
  console.log(`Skipped (missing): ${skipped}`);
  console.log(`Failures (>${MAX_DIFF_PERCENT}% diff): ${failures}`);
  console.log('\nBy route (max diff):');
  byRoute.forEach((r) => {
    console.log(`  ${r.route}: avg ${r.avgPercent}% | max ${r.maxPercent}% | fails ${r.failures}/${r.pairs}`);
  });
  console.log('\nTop diffs:');
  rows.slice(0, 12).forEach((r) => {
    const mark = r.pass ? 'OK' : 'FAIL';
    console.log(
      `  [${mark}] ${r.viewport}/${r.file} — ${r.percent}% (${r.worstRegion.region}: ${r.worstRegion.percent}%) — ${r.classification}`
    );
  });
  console.log(`\nReport: ${reportPath}`);
  console.log(`Diff images: ${diffDir}`);
}

main();
