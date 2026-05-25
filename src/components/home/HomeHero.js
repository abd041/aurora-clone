'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { attachHeroCanvasMirror } from '@/hooks/useHeroCanvasMirror';
import { AuroraSymbolOutline } from '@/components/brand/AuroraSymbol';
import { AURORA_CLIP_SEGMENTS } from '@/lib/auroraSymbolPaths';

/**
 * Index home hero — B0iSZM4m.js / HomeHero.sc0cbmD3.css parity.
 */
export default function HomeHero({ videoUrl }) {
  const rootRef = useRef(null);
  const videoSourceRef = useRef(null);
  const videoDuplicateRef = useRef(null);
  const [hide, setHide] = useState(false);
  const introHandledRef = useRef(false);

  const play = () => {
    videoSourceRef.current?.play().catch(() => {});
  };

  const pause = () => {
    videoSourceRef.current?.pause();
  };

  const getLogoPaths = () => {
    if (typeof document === 'undefined') return [];
    return gsap.utils.toArray('#indexLogo .logo-path');
  };

  const animateLogoPaths = (delay = 0) => {
    const paths = getLogoPaths();
    if (!paths.length) return;

    gsap
      .timeline({
        onComplete: () => {
          rootRef.current?.setAttribute('data-hero-ready', 'true');
          window.dispatchEvent(new CustomEvent('aurora:heroReady'));
        },
      })
      .addLabel('start', `+=${delay}`)
      .to(
        paths,
        {
          scaleX: 1,
          scaleY: 1,
          stagger: { each: 0.2, from: 'start' },
          duration: 1,
          ease: 'quart.out',
          clearProps: 'all',
        },
        'start'
      );
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const paths = getLogoPaths();
    paths.forEach((path, i) => {
      const origin = AURORA_CLIP_SEGMENTS[i]?.transformOrigin ?? 'center center';
      gsap.set(path, { scaleX: 0, scaleY: 1, transformOrigin: origin, transformBox: 'fill-box' });
    });

    const onIntroCompleted = () => {
      if (introHandledRef.current) return;
      introHandledRef.current = true;
      animateLogoPaths(0);
    };

    window.addEventListener('aurora:introCompleted', onIntroCompleted);

    if (document.querySelector('.app') && !document.querySelector('.intro')) {
      introHandledRef.current = true;
      animateLogoPaths(1);
    }

    let detachCanvas = null;
    const video = videoSourceRef.current;
    const duplicate = videoDuplicateRef.current;

    if (video && duplicate) {
      detachCanvas = attachHeroCanvasMirror(video, duplicate);
    }

    const onLeave = () => {
      pause();
      setHide(true);
    };

    const onEnterBack = () => {
      play();
      setHide(false);
    };

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=100%',
            scrub: true,
            onLeave,
            onEnterBack,
          },
        })
        .fromTo(
          root,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 100% 0%)', clearProps: 'all' },
          0
        );
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    const onPageEnter = () => ScrollTrigger.refresh(true);

    window.addEventListener('aurora:resize', onResize);
    window.addEventListener('aurora:pageEnterCompleted', onPageEnter);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener('aurora:introCompleted', onIntroCompleted);
      window.removeEventListener('aurora:resize', onResize);
      window.removeEventListener('aurora:pageEnterCompleted', onPageEnter);
      detachCanvas?.();
      ctx.revert();
    };
  }, [videoUrl]);

  useEffect(() => {
    const video = videoSourceRef.current;
    if (!video || !videoUrl) return undefined;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = 'auto';

    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    video.addEventListener('loadeddata', tryPlay);

    return () => video.removeEventListener('loadeddata', tryPlay);
  }, [videoUrl]);

  return (
    <>
      <section
        className={`home-hero${hide ? ' hide' : ''}`}
        ref={rootRef}
        aria-label="Hero"
      >
        <div className="video-container">
          <video
            src={videoUrl}
            preload="auto"
            muted
            playsInline
            autoPlay
            loop
            ref={videoSourceRef}
          />
        </div>
        <div className="video-mask" aria-hidden>
          <div className="video-mask-item">
            <div className="video-duplicate" ref={videoDuplicateRef} />
            <AuroraSymbolOutline className="home-hero-symbol-outline" strokeWidth={1} />
          </div>
        </div>
        <div className="scroll-down">
          <div className="scroll-down--icon">
            <span />
          </div>
          <span>Scroll down</span>
        </div>
      </section>
      <div className="fake-spacer" aria-hidden />
    </>
  );
}
