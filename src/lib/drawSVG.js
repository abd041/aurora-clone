/*!
 * DrawSVGPlugin 3.12.5 — extracted from original site bundle for 1:1 parity.
 */
'use client';

import gsap from 'gsap';

const B = () => typeof window !== 'undefined';
let h;
let M;
let S;
let V;
let E;
let T;
let A;
let G;

const q = () => h || (B() && (h = gsap) && h.registerPlugin && h);
const j = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/gi;
const D = { rect: ['width', 'height'], circle: ['r', 'r'], ellipse: ['rx', 'ry'], line: ['x2', 'y2'] };
const y = (i) => Math.round(i * 10000) / 10000;
const c = (i) => parseFloat(i) || 0;
const v = (i, e) => {
  const o = c(i);
  return ~i.indexOf('%') ? (o / 100) * e : o;
};
const m = (i, e) => c(i.getAttribute(e));
const k = Math.sqrt;
const O = (i, e, o, r, n, s) =>
  k((c(o) - c(i)) ** 2 * n ** 2 + (c(r) - c(e)) ** 2 * s ** 2);
const L = (i) => console.warn(i);
const I = (i) => i.getAttribute('vector-effect') === 'non-scaling-stroke';
const F = 1;

const W = (i, e, o) => {
  const r = i.indexOf(' ');
  if (r < 0) return [o !== undefined ? o + '' : i, i];
  const n = i.substr(0, r);
  const s = i.substr(r + 1);
  const nv = v(n, e);
  const sv = v(s, e);
  return nv > sv ? [sv, nv] : [nv, sv];
};

const P = (i) => {
  if (!(i = M(i)[0])) return 0;
  const e = i.tagName.toLowerCase();
  const o = i.style;
  let r = 1;
  let n = 1;
  if (I(i)) {
    n = i.getScreenCTM();
    r = k(n.a * n.a + n.b * n.b);
    n = k(n.d * n.d + n.c * n.c);
  }
  let _;
  try {
    _ = i.getBBox();
  } catch {
    L('Some browsers won\'t measure invisible elements (like display:none or masks inside defs).');
  }
  const x = _ || { x: 0, y: 0, width: 0, height: 0 };
  let a = x.x;
  let b = x.y;
  let u = x.width;
  let l = x.height;
  let s;
  let t;
  let p;
  let d;
  let w;
  let g;

  if ((!_ || (!u && !l)) && D[e]) {
    u = m(i, D[e][0]);
    l = m(i, D[e][1]);
    if (e !== 'rect' && e !== 'line') {
      u *= 2;
      l *= 2;
    }
    if (e === 'line') {
      a = m(i, 'x1');
      b = m(i, 'y1');
      u = Math.abs(u - a);
      l = Math.abs(l - b);
    }
  }

  if (e === 'path') {
    p = o.strokeDasharray;
    o.strokeDasharray = 'none';
    s = i.getTotalLength() || 0;
    if (y(r) !== y(n) && !T) {
      T = 1;
      L('Warning: <path> length cannot be measured when vector-effect is non-scaling-stroke and the element isn\'t proportionally scaled.');
    }
    s *= (r + n) / 2;
    o.strokeDasharray = p;
  } else if (e === 'rect') {
    s = u * 2 * r + l * 2 * n;
  } else if (e === 'line') {
    s = O(a, b, a + u, b + l, r, n);
  } else if (e === 'polyline' || e === 'polygon') {
    t = i.getAttribute('points').match(j) || [];
    if (e === 'polygon') t.push(t[0], t[1]);
    s = 0;
    for (d = 2; d < t.length; d += 2) {
      s += O(t[d - 2], t[d - 1], t[d], t[d + 1], r, n) || 0;
    }
  } else if (e === 'circle' || e === 'ellipse') {
    w = (u / 2) * r;
    g = (l / 2) * n;
    s = Math.PI * (3 * (w + g) - k((3 * w + g) * (w + 3 * g)));
  }

  return s || 0;
};

const N = (i, e) => {
  if (!(i = M(i)[0])) return [0, 0];
  e ||= P(i) + 1;
  const o = S.getComputedStyle(i);
  const r = o.strokeDasharray || '';
  let n = c(o.strokeDashoffset);
  let s = r.indexOf(',');
  if (s < 0) s = r.indexOf(' ');
  let dash = s < 0 ? e : c(r.substr(0, s));
  if (dash > e) dash = e;
  return [-n || 0, dash - n || 0];
};

const C = () => {
  if (!B()) return;
  S = window;
  E = h = q();
  M = h.utils.toArray;
  A = h.core.getStyleSaver;
  G = h.core.reverting || (() => {});
  V = ((S.navigator || {}).userAgent || '').indexOf('Edge') !== -1;
};

const DrawSVGPlugin = {
  version: '3.12.5',
  name: 'drawSVG',
  register(i) {
    h = i;
    C();
  },
  init(i, e, o, r, n) {
    if (!i.getBBox) return false;
    E || C();
    const len = P(i);
    let _;
    let t;
    let p;
    this.styles = A && A(i, 'strokeDashoffset,strokeDasharray,strokeMiterlimit');
    this.tween = o;
    this._style = i.style;
    this._target = i;
    if (e + '' === 'true') e = '0 100%';
    else if (e) {
      if ((e + '').indexOf(' ') === -1) e = '0 ' + e;
    } else e = '0 0';
    _ = N(i, len);
    t = W(e, len, _[0]);
    this._length = y(len);
    this._dash = y(_[1] - _[0]);
    this._offset = y(-_[0]);
    this._dashPT = this.add(this, '_dash', this._dash, y(t[1] - t[0]), 0, 0, 0, 0, 0, 1);
    this._offsetPT = this.add(this, '_offset', this._offset, y(-t[0]), 0, 0, 0, 0, 0, 1);
    if (V) {
      p = S.getComputedStyle(i);
      if (p.strokeLinecap !== p.strokeLinejoin) {
        t = c(p.strokeMiterlimit);
        this.add(i.style, 'strokeMiterlimit', t, t + 0.01);
      }
    }
    this._live = I(i) || ~(e + '').indexOf('live');
    this._nowrap = ~(e + '').indexOf('nowrap');
    this._props.push('drawSVG');
    return F;
  },
  render(i, e) {
    if (e.tween._time || !G()) {
      let pt = e._pt;
      const style = e._style;
      let n;
      let s;
      let _;
      let t;
      if (pt) {
        if (e._live) {
          n = P(e._target);
          if (n !== e._length) {
            s = n / e._length;
            e._length = n;
            if (e._offsetPT) {
              e._offsetPT.s *= s;
              e._offsetPT.c *= s;
            }
            if (e._dashPT) {
              e._dashPT.s *= s;
              e._dashPT.c *= s;
            } else {
              e._dash *= s;
            }
          }
        }
        while (pt) {
          pt.r(i, pt.d);
          pt = pt._next;
        }
        _ = e._dash || (i && i !== 1 && 0.0001) || 0;
        n = e._length - _ + 0.1;
        t = e._offset;
        if (_ && t && _ + Math.abs(t % e._length) > e._length - 0.2) {
          t += t < 0 ? 0.1 : -0.1;
          n += 0.1;
        }
        style.strokeDashoffset = _ ? t : t + 0.001;
        style.strokeDasharray =
          n < 0.2 ? 'none' : _ ? `${_}px,${e._nowrap ? 999999 : n}px` : '0px, 999999px';
      }
    } else {
      e.styles.revert();
    }
  },
  getLength: P,
  getPosition: N,
};

export { DrawSVGPlugin };
export default DrawSVGPlugin;
