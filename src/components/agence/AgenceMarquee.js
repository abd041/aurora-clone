'use client';

import LoopLine from '@/components/ui/LoopLine';
import useIsMobile from '@/hooks/useIsMobile';

export default function AgenceMarquee() {
  const isMobile = useIsMobile();
  const gap = isMobile ? 20 : 50;

  return (
    <div className="agence-marquee">
      <LoopLine
        className="marquee__loop"
        direction="right"
        gap={gap}
        gapSmall={gap}
        autoPlay
        autoPlaySpeed={2}
      >
        {[0, 1].map((i) => (
          <span key={i} style={{ display: 'contents' }}>
            <span className="marquee-word"> The agency in </span>
            <span className="marquee-number"> 5 </span>
            <span className="marquee-word"> figures </span>
          </span>
        ))}
      </LoopLine>
    </div>
  );
}
