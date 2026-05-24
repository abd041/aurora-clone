/**
 * Extract Header + Menu scoped CSS from Nuxt entry chunk into styles/original.
 * Run automatically before build:css.
 */
const fs = require('fs');
const path = require('path');

const entryPath = path.join(__dirname, 'reference/entry.8c3gFhnC.css');
const bundle = fs.readFileSync(entryPath, 'utf8');

function extractScope(scopeId, outName) {
  const parts = [];
  let i = 0;
  while (i < bundle.length) {
    const idx = bundle.indexOf(`[data-v-${scopeId}]`, i);
    if (idx < 0) break;
    let start = bundle.lastIndexOf('}', idx);
    if (start < 0 || idx - start > 120) start = idx;
    else start += 1;
    const before = bundle.lastIndexOf('@media', start);
    if (before >= 0 && start - before < 80) start = before;

    let depth = 0;
    let end = idx;
    for (let j = start; j < bundle.length; j++) {
      if (bundle[j] === '{') depth++;
      if (bundle[j] === '}') {
        depth--;
        if (depth === 0) {
          end = j + 1;
          break;
        }
      }
    }
    const chunk = bundle.slice(start, end);
    if (chunk.includes(`[data-v-${scopeId}]`)) parts.push(chunk);
    i = end;
  }
  const css = [...new Set(parts)].join('');
  const out = path.join(__dirname, '../styles/original', outName);
  fs.writeFileSync(out, css);
  return css.length;
}

const headerLen = extractScope('451ea45a', 'Header.451ea45a.css');
const menuLen = extractScope('b22133a4', 'Menu.b22133a4.css');
console.log(`Header.451ea45a.css (${headerLen} chars), Menu.b22133a4.css (${menuLen} chars)`);

module.exports = { extractScope };
