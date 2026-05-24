const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE = 'https://aurora-agency.ovh';
const PUBLIC = path.join(__dirname, '..', 'public');

const extraPaths = [
  '/images/home_9.webp', '/images/home_10.webp', '/images/home_11.webp',
  '/images/home_12.webp', '/images/home_13.webp', '/images/home_14.webp',
  '/images/home_15.webp', '/images/home_16.webp',
  '/images/agence_0.webp',
  '/images/valeur-engagement.webp', '/images/valeur-independance.webp',
  '/images/valeur-humanism.webp', '/images/valeur-performance.webp',
  '/images/join-us.avif',
  '/videos/6b41749645d966da9e26fd7de220fbbf92d9d00e.mp4',
  '/videos/50f5e18ded2faa904046cac7e28c7af2cf2ed4d2.mp4',
  '/videos/7db34db67c5d532677a9f1326c5630b1b1c02382.mp4',
  '/_nuxt/logo-intro.FMLjELMt.png',
  '/_nuxt/mask-intro.BstsseU-.png',
  '/_nuxt/mask-menu.C30cC7M_.png',
  '/_nuxt/footer-logo.DGEgvHlG.png',
  '/_nuxt/map-france-less-dotted.BJ8qf9St.png',
  '/_nuxt/map-france-dotted.D6Ojo-by.png',
  '/_nuxt/intro-bg-mobile.goTljaNO.png',
  '/_nuxt/other-projects.Cjq-Ezm8.png',
  '/_nuxt/card-logo.CSDv1VlM.png',
];

for (let i = 1; i <= 9; i++) extraPaths.push(`/images/physics/${i}.png`);

// Realisation gallery images
for (let r = 0; r <= 6; r++) {
  for (let g = 0; g <= 3; g++) {
    extraPaths.push(`/images/realisations/real_${r}_gallery_${g}.webp`);
    extraPaths.push(`/images/realisations/real_${r}_gallery_${g}.jpg`);
  }
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(dest)) return resolve('skip');
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode === 404) return reject(new Error('404'));
      if (res.statusCode !== 200) return reject(new Error(String(res.statusCode)));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve('ok')));
    }).on('error', reject);
  });
}

(async () => {
  let ok = 0, skip = 0, fail = 0;
  for (const p of extraPaths) {
    try {
      const r = await download(`${BASE}${p}`, path.join(PUBLIC, p.replace(/^\//, '')));
      r === 'skip' ? skip++ : ok++;
    } catch {
      fail++;
    }
  }
  console.log(`Done: ${ok} downloaded, ${skip} skipped, ${fail} failed`);
})();
