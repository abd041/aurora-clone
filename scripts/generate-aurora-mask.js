/**
 * Builds figure-8 mask SVG from aurora-symbol-paths.json (hero + HomeVideo CSS mask).
 * Regenerate: node scripts/generate-aurora-mask.js
 */
const fs = require('fs');
const path = require('path');

const symbolData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/aurora-symbol-paths.json'), 'utf8')
);

const paths = symbolData.clipSegments
  .map((seg) => `<path fill="#fff" d="${seg.d}"/>`)
  .join('\n  ');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" width="400" height="400">
  ${paths}
</svg>
`;

const outDir = path.join(__dirname, '../public/masks');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'aurora-figure8-mask.svg'), svg);
console.log('Wrote public/masks/aurora-figure8-mask.svg');
