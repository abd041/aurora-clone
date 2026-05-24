'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import RevealLines from '@/components/ui/RevealLines';
import useSplitLines from '@/hooks/useSplitLines';

function JoinLogoClip() {
  return (
    <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <clipPath id="logoIntro" clipPathUnits="objectBoundingBox">
          <path className="logo-path" d="M0 0.5C0 0.5 0 0.5001 0 0.5002H0.217H0.217C0.217 0.5002 0.217 0.5001 0.217 0.5C0.217 0.343 0.343 0.217 0.5 0.217V0C0.223 0 0 0.223 0 0.5Z" />
          <path className="logo-path" d="M1 0.001C1 0.001 1 0.0009 1 0.0008H0.782H0.782C0.782 0.0008 0.782 0.0009 0.782 0.001C0.782 0.157 0.657 0.282 0.5 0.282V0.5C0.777 0.5 1 0.277 1 0.001Z" />
          <path className="logo-path" d="M0 1C0 1 0 0.9999 0 0.9998H0.217H0.217C0.217 0.9998 0.217 0.9999 0.217 1C0.217 0.843 0.343 0.717 0.5 0.717V0.5C0.223 0.5 0 0.723 0 1Z" />
          <path className="logo-path" d="M1 0.5C1 0.5 1 0.5001 1 0.5002H0.782H0.782C0.782 0.5002 0.782 0.5001 0.782 0.5C0.782 0.657 0.657 0.782 0.5 0.782V1C0.777 1 1 0.777 1 0.5Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

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

      const img = rootRef.current.querySelector('.video-mask-item img');
      if (!img) return;

      gsap.set(img, { clearProps: 'all' });

      const tl = gsap.timeline({
        scrollTrigger: {
          start: 'top top',
          end: '+=100%',
          scrub: true,
        },
      });
      tl.to(img, { yPercent: 25 }, 0);
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
      <div className="video-mask">
        <div className="video-mask-item">
          <img src={background} alt={title} />
        </div>
      </div>
      <h1 ref={titleRef}>{title}</h1>
      {description && (
        <div className="hero-desc">
          <RevealLines tag="p">{description}</RevealLines>
        </div>
      )}
      <JoinLogoClip />
    </section>
  );
}
