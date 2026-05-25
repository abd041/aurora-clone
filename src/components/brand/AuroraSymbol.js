import {
  AURORA_CLIP_SEGMENTS,
  AURORA_FILLED_PATH,
  AURORA_OUTLINE_PATH,
  AURORA_VIEWBOX,
} from '@/lib/auroraSymbolPaths';

const VB = AURORA_VIEWBOX.replace('0 0 ', '').split(' ').map(Number);
const [VB_W, VB_H] = VB.length >= 2 ? [VB[2] ?? 100, VB[3] ?? 100] : [100, 100];

/**
 * Clip-path defs for video masks (hero, join, réalisations, etc.).
 */
export function AuroraClipDefs({ clipId = 'indexLogo' }) {
  return (
    <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          {AURORA_CLIP_SEGMENTS.map((seg) => (
            <path key={seg.id} className="logo-path" d={seg.d} />
          ))}
        </clipPath>
      </defs>
    </svg>
  );
}

function sizeProps(size) {
  if (size == null) return { width: '100%', height: '100%' };
  if (typeof size === 'number') return { width: size, height: size };
  return { width: size.width, height: size.height };
}

/**
 * Master brand mark — outline, filled, or low-opacity watermark.
 */
export default function AuroraSymbol({
  variant = 'outline',
  className = 'aurora-symbol',
  size,
  strokeWidth = 1.15,
  style,
  preserveAspectRatio = 'xMidYMid meet',
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
}) {
  const dims = sizeProps(size);
  const shared = {
    className: [
      'aurora-symbol',
      `aurora-symbol--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' '),
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `0 0 ${VB_W} ${VB_H}`,
    preserveAspectRatio,
    style,
    ...dims,
    'aria-hidden': ariaLabel ? undefined : ariaHidden,
    'aria-label': ariaLabel,
  };

  if (variant === 'filled' || variant === 'watermark') {
    return (
      <svg {...shared}>
        <path d={AURORA_FILLED_PATH} fill="currentColor" fillRule="evenodd" />
      </svg>
    );
  }

  return (
    <svg {...shared} fill="none">
      <path
        d={AURORA_OUTLINE_PATH}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Thin outline infinity — alias for existing call sites. */
export function AuroraSymbolOutline(props) {
  return <AuroraSymbol variant="outline" {...props} />;
}

/** Solid infinity — menu icons, etc. */
export function AuroraSymbolFilled(props) {
  return <AuroraSymbol variant="filled" {...props} />;
}

/** Large faded footer / background decorative mark. */
export function AuroraSymbolWatermark(props) {
  return <AuroraSymbol variant="watermark" {...props} />;
}
