/**
 * Builds dotted Switzerland map from official simplified border (GeoJSON).
 * Regenerate: node scripts/generate-switzerland-map.js
 */
const fs = require('fs');
const path = require('path');

const W = 400;
const H = 500;
const PADDING = 18;
const DOT_STEP = 7;
const DOT_R = 2.25;
const DOT_FILL = '#977DBD';
const DOT_OPACITY = 0.72;

/** Interlaken — WGS84 */
const INTERLAKEN_LON = 7.8632;
const INTERLAKEN_LAT = 46.6863;

const geoPath = path.join(__dirname, 'che.geo.json');
const geo = JSON.parse(fs.readFileSync(geoPath, 'utf8'));
const ring = geo.features[0].geometry.coordinates[0];

function projectRing(ring, width, height, pad) {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const [lon, lat] of ring) {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  const lonSpan = maxLon - minLon;
  const latSpan = maxLat - minLat;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const scale = Math.min(innerW / lonSpan, innerH / latSpan);
  const mapW = lonSpan * scale;
  const mapH = latSpan * scale;
  const offsetX = pad + (innerW - mapW) / 2;
  const offsetY = pad + (innerH - mapH) / 2;

  const project = (lon, lat) => [
    offsetX + (lon - minLon) * scale,
    offsetY + (maxLat - lat) * scale,
  ];

  const poly = ring.map(([lon, lat]) => project(lon, lat));

  return { poly, project, minLon, maxLon, minLat, maxLat };
}

function inside(x, y, poly) {
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      ins = !ins;
    }
  }
  return ins;
}

const { poly, project } = projectRing(ring, W, H, PADDING);
const [interlakenX, interlakenY] = project(INTERLAKEN_LON, INTERLAKEN_LAT);

const dots = [];
for (let y = 0; y < H; y += DOT_STEP) {
  for (let x = 0; x < W; x += DOT_STEP) {
    if (inside(x, y, poly)) dots.push([x, y]);
  }
}

const circles = dots
  .map(
    ([x, y]) =>
      `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${DOT_R}" fill="${DOT_FILL}" fill-opacity="${DOT_OPACITY}"/>`
  )
  .join('\n');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
${circles}
</svg>`;

const meta = {
  viewBox: { width: W, height: H },
  interlaken: {
    x: Math.round(interlakenX * 10) / 10,
    y: Math.round(interlakenY * 10) / 10,
  },
  dotCount: dots.length,
};

const outDir = path.join(__dirname, '../public/_nuxt');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'map-switzerland-less-dotted.svg'), svg);
fs.writeFileSync(
  path.join(__dirname, '../src/data/switzerlandMapMeta.json'),
  JSON.stringify(meta, null, 2)
);

console.log(`Wrote ${dots.length} dots → public/_nuxt/map-switzerland-less-dotted.svg`);
console.log(`Interlaken @ (${meta.interlaken.x}, ${meta.interlaken.y})`);
