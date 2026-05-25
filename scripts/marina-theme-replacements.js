/**
 * Hex → CSS variable replacements applied when building aurora.css.
 * Longest patterns first to avoid partial matches.
 */
const REPLACEMENTS = [
  ['#11121d00', 'rgba(var(--marina-cream-rgb), 0)'],
  ['#11121d', 'var(--background)'],
  ['#977ebd', 'var(--primary)'],
  ['#977dbd', 'var(--primary)'],
  ['#f3c4c933', 'rgba(var(--marina-sky-rgb), 0.2)'],
  ['#f3c4c9', 'var(--secondary)'],
  ['#181925', 'var(--card)'],
  ['#3d3f4f', 'var(--marina-border-strong)'],
  ['#d4acc5', 'var(--humanisme)'],
  ['#b695c1', 'var(--performance)'],
  ['#65488e', 'var(--primary)'],
  ['#2c273d', 'var(--primary)'],
  ['#3e363f', 'var(--marina-slate-muted)'],
  ['#000000e6', 'var(--overlay-heavy)'],
  ['#00000080', 'var(--overlay-heavy)'],
  ['#00000040', 'var(--overlay-medium)'],
  ['#0006', 'var(--overlay-light)'],
  ['#0003', 'var(--overlay-light)'],
  ['#ffffff26', 'rgba(var(--marina-cream-rgb), 0.15)'],
  ['#ffffff1a', 'var(--glass-bg)'],
  ['#ff000040', 'rgba(var(--marina-brown-rgb), 0.12)'],
  ['#00800040', 'rgba(var(--marina-sky-rgb), 0.25)'],
  ['#ffffff', 'var(--card-elevated)'],
  ['#fff', 'var(--foreground)'],
  [
    'linear-gradient(229.09deg,#977dbd 2.34%,#f3c4c9 97.65%)',
    'var(--gradient-brand-underline)',
  ],
  [
    'linear-gradient(229.09deg,#977dbd 5.56%,#f3c4c9 93.74%)',
    'var(--gradient-brand-underline)',
  ],
  [
    'linear-gradient(244.1deg,#f3c4c9 11.22%,#977dbd 89.21%)',
    'var(--gradient-brand-soft)',
  ],
  ['linear-gradient(90deg,#977dbd,#f3c4c9)', 'var(--gradient-brand-horizontal)'],
  ['linear-gradient(90deg,#977dbd 0,#f3c4c9 100%)', 'var(--gradient-text-clip)'],
  [
    'linear-gradient(64deg,#977dbd 47.85%,#f3c4c9 99.07%)',
    'var(--gradient-warm-voile)',
  ],
  ['linear-gradient(180deg,#11121d 48.25%,#11121d00 82.5%)', 'var(--gradient-fade-top)'],
  ['linear-gradient(0deg,#000,transparent)', 'var(--gradient-fade-bottom)'],
  ['linear-gradient(180deg,transparent,#000)', 'var(--gradient-fade-image)'],
  ['linear-gradient(180deg,#000,transparent)', 'var(--gradient-fade-image)'],
  ['linear-gradient(67.82deg,#977dbd 11.33%,#f3c4c9 91.73%)', 'var(--gradient-text-clip)'],
  ['rgba(243,196,201,.3)', 'rgba(var(--marina-sky-rgb), 0.35)'],
  ['rgba(243,196,201,0.3)', 'rgba(var(--marina-sky-rgb), 0.35)'],
];

function applyMarinaReplacements(css) {
  let out = css;
  for (const [from, to] of REPLACEMENTS) {
    out = out.split(from).join(to);
    const upper = from.toUpperCase();
    if (upper !== from) {
      out = out.split(upper).join(to);
    }
  }
  return out;
}

module.exports = { REPLACEMENTS, applyMarinaReplacements };
