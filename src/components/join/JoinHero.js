'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import RevealLines from '@/components/ui/RevealLines';
import useSplitLines from '@/hooks/useSplitLines';
import { AuroraClipDefs, AuroraSymbolOutline } from '@/components/brand/AuroraSymbol';

export default function JoinHero({ background, title, description }) {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const timelinesRef = useRef([]);
  useSplitLines(titleRef, { delay: 0.75 });

  useEffect(() => {
    const mount = async () => {
      timelinesRef.current.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
      timelinesRef.current = [];

      if (!rootRef.current) return;

      await document.fonts.ready;

      const maskItem = rootRef.current.querySelector('.video-mask-item');
      if (!maskItem) return;

      gsap.set(maskItem, { clearProps: 'transform' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: true,
        },
      });
      tl.to(maskItem, { yPercent: 8 }, 0);
      timelinesRef.current.push(tl);
    };

    mount();
    window.addEventListener('aurora:pageEnterCompleted', mount);

    return () => {
      window.removeEventListener('aurora:pageEnterCompleted', mount);
      timelinesRef.current.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
      timelinesRef.current = [];
    };
  }, []);

  return (
    <section className="hero-video-sticky" ref={rootRef}>
      <div className="hero-bg">
        <div className="bg-sticky">
          <img src={background} alt={title} />
        </div>
      </div>
      <div className="video-mask" aria-hidden>
        <div className="video-mask-center">
          <div className="video-mask-item">
            <img src={background} alt="" />
            <AuroraSymbolOutline
              className="join-hero-symbol-outline"
              strokeWidth={1}
              aria-hidden
            />
          </div>
        </div>
      </div>
      <h1 ref={titleRef}>{title}</h1>
      {description && (
        <div className="hero-desc">
          <RevealLines tag="p">{description}</RevealLines>
        </div>
      )}
      <AuroraClipDefs clipId="indexLogo" />
    </section>
  );
}
