/**
 * Strip [data-v-xxx] from a component CSS file and prefix selectors for scoping.
 * Usage: node scripts/extract-scope-css.js HomeVideo.B4Wg4gsJ.css index .home-video
 */
const fs = require('fs');
const path = require('path');

const [, , fileName, scopeClass, prefix] = process.argv;

if (!fileName || !scopeClass || !prefix) {
  console.error(
    'Usage: node scripts/extract-scope-css.js <file in styles/original> <scope-class> <selector-prefix>'
  );
  process.exit(1);
}

const inputPath = path.join(__dirname, '../styles/original', fileName);
let css = fs.readFileSync(inputPath, 'utf8');

css = css.replace(/\[data-v-[a-f0-9]+\]/g, '');
css = css.replace(/\$ease-out-quart/g, 'cubic-bezier(0.165, 0.84, 0.44, 1)');
css = css.replace(/\$ease-in-out-quart/g, 'cubic-bezier(0.77, 0, 0.175, 1)');

// Strip duplicate global resets at start of vue scoped files
css = css.replace(/body\{[^}]*\}/g, '');
css = css.replace(/\.title\{[^}]*\}/g, '');
css = css.replace(/@media only screen and \(max-width:440px\)\{\.title\{[^}]*\}\}/g, '');
css = css.replace(/\.big-title\{[^}]*\}/g, '');
css = css.replace(/\.project-title\{[^}]*\}/g, '');
css = css.replace(/\.category[^{]*\{[^}]*\}/g, '');
css = css.replace(/\.t-center\{[^}]*\}/g, '');
css = css.replace(/\.link[^{]*\{[^}]*\}/g, '');
css = css.replace(/\.link:after\{[^}]*\}/g, '');
css = css.replace(/\.link:hover:after\{[^}]*\}/g, '');

const scope = scopeClass.startsWith('.') ? scopeClass : `.${scopeClass}`;
const pre = prefix.trim();

function prefixSelector(sel) {
  const s = sel.trim();
  if (!s || s.startsWith('@keyframes')) return sel;
  if (s.startsWith('@media')) return sel;
  return s
    .split(',')
    .map((part) => {
      const p = part.trim();
      if (p.startsWith(scope)) return p;
      if (p === pre || p.startsWith(`${pre} `) || p.startsWith(`${pre}.`) || p.startsWith(`${pre}:`)) {
        return `${scope} ${p}`;
      }
      if (p.startsWith('.home-title')) return `${scope} ${p}`;
      if (p.startsWith('.video-mask') || p.startsWith('.home-video')) {
        return `${scope} ${p}`;
      }
      return `${scope} ${pre} ${p}`;
    })
    .join(', ');
}

css = css.replace(/(@[^{]+)\{([^}]*)\}/g, (match, atRule, body) => {
  if (atRule.includes('@media')) {
    const inner = body.replace(/([^{}]+)\{([^{}]*)\}/g, (m, sel, rules) => {
      if (sel.trim().startsWith('@')) return m;
      return `${prefixSelector(sel)}{${rules}}`;
    });
    return `${atRule}{${inner}}`;
  }
  return match;
});

css = css.replace(/([^{}@]+)\{([^{}]*)\}/g, (match, sel, rules) => {
  if (sel.trim().startsWith('@')) return match;
  if (sel.includes('{')) return match;
  return `${prefixSelector(sel)}{${rules}}`;
});

const outName = fileName.replace(/\.css$/, '.scoped.css');
const outPath = path.join(__dirname, '../src/styles', outName);
const header = `/**\n * Scoped from styles/original/${fileName}\n * Scope: ${scope} ${pre}\n */\n\n`;

fs.writeFileSync(outPath, header + css.trim());
console.log('Wrote', outPath);
