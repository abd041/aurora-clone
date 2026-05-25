import { AuroraClipDefs, AuroraSymbolOutline } from '@/components/brand/AuroraSymbol';

/**
 * Same visual system as the index hero video mask:
 * square clip (four lobes / figure-8) + thin outline overlay.
 * Used in footer watermark and other decorative placements.
 */
export default function AuroraHeroMark({
  className = '',
  clipId = 'footerHeroMark',
  strokeWidth = 1,
}) {
  return (
    <>
      <AuroraClipDefs clipId={clipId} />
      <div className={`aurora-hero-mark ${className}`.trim()}>
        <div className="aurora-hero-mark__item">
          <div className="aurora-hero-mark__fill" aria-hidden />
          <AuroraSymbolOutline
            className="home-hero-symbol-outline"
            strokeWidth={strokeWidth}
          />
        </div>
      </div>
    </>
  );
}
