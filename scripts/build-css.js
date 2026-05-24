const fs = require('fs');
const path = require('path');

const CSS_DIR = path.join(__dirname, '..', 'styles', 'original');
const OUT = path.join(__dirname, '..', 'src', 'styles', 'aurora.css');

const EASING = {
  '$ease-out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  '$ease-in-out-quart': 'cubic-bezier(0.77, 0, 0.175, 1)',
  '$ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
  '$ease-in-out-expo': 'cubic-bezier(1, 0, 0, 1)',
};

const BASE_RESET = `html{box-sizing:border-box}*{margin:0;padding:0}*,:after,:before{box-sizing:inherit}body,html{margin:0;-ms-overflow-style:none;scrollbar-width:none}body ::-webkit-scrollbar,html ::-webkit-scrollbar{display:none}svg{display:block;vertical-align:middle;fill:currentColor}a{color:inherit;font-size:inherit;text-decoration:none}button{cursor:pointer;font:inherit;font-family:inherit;font-size:100%;margin:0;padding:0}button,input,select,textarea{background:none;border:none;color:inherit;outline:none;appearance:none;-moz-appearance:none;-webkit-appearance:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:inherit;letter-spacing:inherit;line-height:inherit;text-transform:inherit}fieldset{border:none}ul{list-style:none}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}.svg-filters{pointer-events:none;position:absolute;visibility:hidden}em{font-style:italic}strong{font-weight:700}li{list-style-type:none}`;

const FONTS = `@font-face{font-display:swap;font-family:Almarena;font-style:normal;font-weight:700;src:url(/_nuxt/AlmarenaDisplayBold.B_zlv4U7.woff2) format("woff2")}@font-face{font-display:swap;font-family:Almarena;font-style:normal;font-weight:400;src:url(/_nuxt/AlmarenaDisplayRegular.xDodwvgA.woff2) format("woff2")}@font-face{font-display:swap;font-family:Almarena;font-style:normal;font-weight:300;src:url(/_nuxt/AlmarenaDisplayLight.DGJenzB8.woff2) format("woff2")}@font-face{font-display:swap;font-family:"Almarena Mono";font-style:normal;font-weight:700;src:url(/_nuxt/AlmarenaMonoDisplayBold.BbrPqgE4.woff2) format("woff2")}@font-face{font-display:swap;font-family:"Almarena Mono";font-style:normal;font-weight:300;src:url(/_nuxt/AlmarenaMonoDisplayLight.HMkLUMzG.woff2) format("woff2")}`;

const VARS = `:root{--black:#11121d;--black-rgb:17,18,29;--white:#fff;--white-rgb:255,255,255;--gray:#f3c4c9;--gray-rgb:243,196,201;--blue:#977dbd;--blue-rgb:151,125,189;--engagement:#f3c4c9;--engagement-rgb:243,196,201;--humanisme:#d4acc5;--humanisme-rgb:212,172,197;--performance:#b695c1;--performance-rgb:182,149,193;--independance:#977ebd;--independance-rgb:151,126,189}body{font-family:Almarena,sans-serif;-webkit-font-smoothing:antialiased;background:var(--black);color:var(--white);font-size:1rem;line-height:1}.title{font-size:4.375rem;font-weight:700;letter-spacing:-.04em;line-height:90%}@media only screen and (max-width:440px){.title{font-size:2.5rem}}.big-title{font-size:5.625rem;font-weight:700;letter-spacing:-.04em;line-height:1}.project-title{font-size:clamp(40px,6.94444vw,100px)}.category,.project-title{font-weight:700;line-height:.9}.category{font-size:.625rem;letter-spacing:.1em;text-transform:uppercase}.t-center{text-align:center}.link{position:relative}.link:not(.hide-u):after{transform:scaleX(1);transform-origin:left}.link:not(.hide-u):hover:after{transform:scaleX(0);transform-origin:right}.link:hover:after{transform:scaleX(1);transform-origin:left}.link:after{background:linear-gradient(229.09deg,#977dbd 2.34%,#f3c4c9 97.65%);bottom:-.5rem;content:"";height:.09375rem;left:0;position:absolute;transform:scaleX(0);transform-origin:right;transition:transform .45s cubic-bezier(.23,1,.32,1);width:100%}.fade-enter-active,.fade-leave-active{transition:opacity .3s}.fade-enter,.fade-enter-from,.fade-leave-to{opacity:0}.page-enter-active,.page-leave-active{transition:opacity .3s}.page-enter,.page-leave-to{opacity:0}.grid{display:grid;grid-template-columns:repeat(24,1fr);grid-gap:.5rem}.flex-center{align-items:center;display:flex;justify-content:center}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}.whitespace-pre-line{white-space:pre-line}.uppercase{text-transform:uppercase}.page{min-height:100vh;min-height:calc(var(--vh,1vh)*100)}.hide{display:none}.o-hidden{overflow:hidden}.t-right{text-align:right}.fake-spacer{height:100vh;height:100dvh;position:relative;width:100%}.Icon{display:inline-block;height:1em;vertical-align:middle;width:1em;fill:currentColor;pointer-events:none}.Icon.no-fill{fill:none}.Icon.no-size{height:auto;width:auto}.split{margin-bottom:.625rem;position:relative}.split-parent{margin-bottom:-.625rem;overflow:hidden}`;

function processCss(content) {
  let css = content;
  // Remove scoped attribute selectors
  css = css.replace(/\[data-v-[a-f0-9]+\]/g, '');
  // Remove duplicate body/title blocks at start of each file (keep component-specific only)
  // Strip repeated global utility blocks only at rule boundaries (avoid breaking :not(.link) etc.)
  css = css.replace(/(?:^|})body\{[^}]*\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  css = css.replace(/(?:^|})\.title\{[^}]*\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  css = css.replace(/(?:^|})@media only screen and \(max-width:440px\)\{\.title\{[^}]*\}\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  css = css.replace(/(?:^|})\.big-title\{[^}]*\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  css = css.replace(/(?:^|})\.project-title\{[^}]*\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  css = css.replace(/(?:^|})\.category[^{]*\{[^}]*\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  css = css.replace(/(?:^|})\.t-center\{[^}]*\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  css = css.replace(/(?:^|})\.link\{[^}]*\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  css = css.replace(/(?:^|})\.link:after\{[^}]*\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  css = css.replace(/(?:^|})\.link:not\(\.hide-u\)[^{]*\{[^}]*\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  css = css.replace(/(?:^|})\.link:hover:after\{[^}]*\}/g, (m) => (m.startsWith('}') ? '}' : ''));
  // Fix asset URLs
  css = css.replace(/url\(\.\.\/images\//g, 'url(/images/');
  css = css.replace(/url\(\.\//g, 'url(/_nuxt/');
  css = css.replace(/url\(\/_nuxt\//g, 'url(/_nuxt/');
  css = css.replace(/url\(\/images\/bg-/g, 'url(/_nuxt/');
  // Replace easing variables
  for (const [key, val] of Object.entries(EASING)) {
    css = css.split(key).join(val);
  }
  return css;
}

function extractComponentCss(content) {
  return processCss(content);
}

const files = fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css'));
let combined = BASE_RESET + '\n' + FONTS + '\n' + VARS + '\n';

for (const file of files) {
  const content = fs.readFileSync(path.join(CSS_DIR, file), 'utf8');
  const processed = extractComponentCss(content);
  if (processed.trim()) {
    combined += `\n/* ${file} */\n${processed}\n`;
  }
}

// Lenis styles
combined += `\nhtml.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}.lenis.lenis-stopped{overflow:hidden}.lenis.lenis-smooth iframe{pointer-events:none}.app{min-height:100dvh;min-height:100vh}.page-wrapper{position:relative}\n`;

// Fix Header button vs Menu overlay `.menu` class collision after unscoped merge
combined = combined.replace(
  /\.menu\{top:0;right:0;bottom:0;left:0;position:fixed;z-index:1099\}\.menu,\.menu-container\{height:100%;width:100%\}/,
  '.menu.page{top:0;right:0;bottom:0;left:0;position:fixed;z-index:1099;height:100%;width:100%}.menu.page .menu-container{height:100%;width:100%}'
);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, combined);
console.log(`Wrote ${OUT} (${(combined.length / 1024).toFixed(1)} KB)`);
