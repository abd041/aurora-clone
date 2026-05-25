'use client';

import mapMeta from '@/data/switzerlandMapMeta.json';

/** Interlaken — projected from GeoJSON border (see scripts/generate-switzerland-map.js). */
export const INTERLAKEN_MAP_X = mapMeta.interlaken.x;
export const INTERLAKEN_MAP_Y = mapMeta.interlaken.y;

export function SwitzerlandMapIndicator({ x = INTERLAKEN_MAP_X, y = INTERLAKEN_MAP_Y, region = 'interlaken' }) {
  const gradId = `map-indicator-grad-${region}`;

  return (
    <g className={`map-indicator map-indicator--${region}`} transform={`translate(${x} ${y})`}>
      <circle className="map-indicator__glow" r="14" fill="url(#paint_indicator_glow)" opacity="0.35" />
      <circle className={`svg-point ${region}`} r="3.5" fill="var(--card)" />
      <circle
        className={`svg-point svg-circle ${region}`}
        r="28"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
      />
      <circle
        className={`svg-point svg-circle ${region}`}
        r="28"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
      />
      <circle
        className={`svg-point svg-circle ${region}`}
        r="28"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
      />
      <defs>
        <radialGradient id="paint_indicator_glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--secondary)" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={gradId}
          x1="-28"
          y1="28"
          x2="28"
          y2="-28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.144643" stopColor="var(--primary)" />
          <stop offset="0.8625" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>
    </g>
  );
}

export default function SwitzerlandMapSvg({ region = 'interlaken' }) {
  return (
    <svg
      className="map-svg-layer"
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <SwitzerlandMapIndicator region={region} />
    </svg>
  );
}
