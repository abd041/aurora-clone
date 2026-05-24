'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import VideoPlayer from '@/components/shared/VideoPlayer';
import { useCursorHandlers } from '@/lib/cursorStore';
import useIsMobile from '@/hooks/useIsMobile';
import useSplitLines from '@/hooks/useSplitLines';

function AgenceHeroTitle({ children }) {
  const ref = useRef(null);
  useSplitLines(ref, { delay: 0.75 });
  return (
    <h1 className="agence-hero--title" ref={ref}>
      {children}
    </h1>
  );
}

export default function AgenceHero({ title, videoBg, videoFull }) {
  const rootRef = useRef(null);
  const isMobile = useIsMobile();
  const { onCursorEnter, onCursorLeave } = useCursorHandlers();
  const [playerOpen, setPlayerOpen] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return undefined;
    const q = gsap.utils.selector(rootRef.current);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: true,
      },
    });
    tl.to(q('video'), { yPercent: 20, clearProps: 'all' }, 0);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <>
      <div
        className="agence-hero"
        onClick={() => setPlayerOpen(true)}
        onMouseEnter={onCursorEnter}
        onMouseLeave={onCursorLeave}
        ref={rootRef}
        role="presentation"
      >
        <div className="agence-hero--bg">
          <div className="bg-voile" />
          {isMobile && (
            <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle
                className="draw-svg"
                cx="80"
                cy="80"
                r="79.25"
                stroke="url(#agenceHeroGrad)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                className="draw-svg"
                fill="none"
                d="M87.979 77.3083C89.6629 78.7077 89.6628 81.2923 87.979 82.6917L77.8366 91.1211C75.5561 93.0164 72.0995 91.3946 72.0995 88.4293L72.0995 71.5707C72.0995 68.6054 75.5561 66.9836 77.8366 68.8789L87.979 77.3083Z"
                stroke="white"
              />
              <defs>
                <linearGradient id="agenceHeroGrad" x1="132" y1="28" x2="27.5" y2="132.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F3C4C9" />
                  <stop offset="1" stopColor="#977DBD" />
                </linearGradient>
              </defs>
            </svg>
          )}
          <video
            src={videoBg}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        </div>
        <AgenceHeroTitle>{title}</AgenceHeroTitle>
      </div>
      {playerOpen && (
        <VideoPlayer src={videoFull || videoBg} onClose={() => setPlayerOpen(false)} />
      )}
    </>
  );
}
