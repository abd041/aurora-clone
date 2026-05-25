'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import CircleBtn from '@/components/ui/CircleBtn';
import HomeTitle from '@/components/home/HomeTitle';
import useIsMobile from '@/hooks/useIsMobile';
import useLazyInView from '@/hooks/useLazyInView';
import { useApp } from '@/context/AppContext';
import { getDeviceState } from '@/lib/device';
import { AuroraSymbolOutline } from '@/components/brand/AuroraSymbol';

function CloseBtnCenter({ onClick }) {
  return (
    <button type="button" className="close close--center" onClick={onClick} aria-label="Close">
      <div className="close-background" />
      <div className="close-item">
        <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <line x1="1" y1="11" x2="11" y2="1" stroke="currentColor" strokeWidth="2" />
          <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </button>
  );
}

export default function HomeVideo({
  title,
  firstTitle,
  secondTitle,
  description,
  video,
}) {
  const rootRef = useRef(null);
  const videoElRef = useRef(null);
  const { ref: lazyRef, shouldLoad } = useLazyInView({ rootMargin: '500px' });
  const isMobile = useIsMobile();
  const { lenis } = useApp();
  const [showTitle, setShowTitle] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [titleDelayInstant, setTitleDelayInstant] = useState(false);
  const timelinesRef = useRef([]);
  const fullscreenRef = useRef(false);

  const setRootRef = (node) => {
    rootRef.current = node;
    lazyRef.current = node;
  };

  const killTimelines = () => {
    ScrollTrigger.getById('home-video-exit')?.kill();
    timelinesRef.current.forEach((tl) => {
      tl.scrollTrigger?.kill(false);
      tl.kill();
    });
    timelinesRef.current = [];
  };

  const setupScrollAnimations = () => {
    if (!rootRef.current) return;

    const q = gsap.utils.selector(rootRef.current);
    const { windowWidth } = getDeviceState();
    const w = typeof window !== 'undefined' ? window.innerWidth : windowWidth;
    const mobileStart = Math.round(windowWidth * 0.8);
    const desktopStart = Math.round(windowWidth * 0.3125);
    const maskFrom = isMobile
      ? {
          maskSize: `${mobileStart}px ${mobileStart}px`,
          webkitMaskSize: `${mobileStart}px ${mobileStart}px`,
          maskPosition: '50% 50%',
          webkitMaskPosition: '50% 50%',
        }
      : {
          maskSize: `${desktopStart}px ${desktopStart}px`,
          webkitMaskSize: `${desktopStart}px ${desktopStart}px`,
          maskPosition: '50% 50%',
          webkitMaskPosition: '50% 50%',
        };
    const maskTo = isMobile
      ? {
          maskSize: `${80 * w}px ${80 * w}px`,
          webkitMaskSize: `${80 * w}px ${80 * w}px`,
          maskPosition: '100% 0%',
          webkitMaskPosition: '100% 0%',
        }
      : {
          maskSize: `${20 * w}px ${20 * w}px`,
          webkitMaskSize: `${20 * w}px ${20 * w}px`,
          maskPosition: '100% 0%',
          webkitMaskPosition: '100% 0%',
        };

    const maskSizeFrom = isMobile
      ? { width: mobileStart, height: mobileStart }
      : { width: desktopStart, height: desktopStart };
    const maskSizeTo = isMobile
      ? { width: 80 * w, height: 80 * w }
      : { width: 20 * w, height: 20 * w };

    gsap.set(q('.video-mask-item'), maskFrom);
    gsap.set(q('.home-video-symbol-outline'), {
      ...maskSizeFrom,
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      position: 'absolute',
    });

    const maskTl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: '+=300%',
        scrub: true,
      },
      defaults: { ease: 'none' },
    });

    maskTl
      .fromTo(q('.video-mask-item'), maskFrom, maskTo, 0)
      .fromTo(q('.home-video-symbol-outline'), maskSizeFrom, maskSizeTo, 0);

    const titleHideTl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: 'top+=50%',
        scrub: true,
        onLeave: () => setShowTitle(false),
        onEnterBack: () => {
          setShowTitle(true);
          setTitleDelayInstant(true);
        },
      },
    });

    const uiRevealTl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top+=50% top',
        end: 'bottom top',
        scrub: false,
        toggleActions: 'play none restart reset',
        onEnter: () => {
          gsap.set(q('.magnetic'), { x: 0, y: 0 });
        },
      },
      defaults: { ease: 'none' },
    });

    uiRevealTl
      .addLabel('start')
      .set(q('.circle-btn'), { transformOrigin: 'center' })
      .fromTo(
        ['.big-title span', '.home-video--container p'],
        { autoAlpha: 0, y: 100 },
        { autoAlpha: 1, y: 0, stagger: 0.1, ease: 'quart.out', clearProps: 'all' },
        'start'
      )
      .from(
        q('.circle-btn'),
        {
          scale: 0,
          y: 100,
          duration: 1,
          ease: 'quart.out',
          clearProps: 'transform, transform-origin',
        },
        'start+=0.1'
      );

    const setFixedOverlayVisible = (visible) => {
      if (visible && fullscreenRef.current) return;

      gsap.set(q('.home-video--container, .video-mask'), {
        autoAlpha: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      });
    };

    ScrollTrigger.create({
      id: 'home-video-exit',
      trigger: rootRef.current,
      start: 'bottom top',
      onEnter: () => setFixedOverlayVisible(false),
      onLeaveBack: () => setFixedOverlayVisible(true),
    });

    timelinesRef.current.push(maskTl, titleHideTl, uiRevealTl);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  useEffect(() => {
    if (!rootRef.current) return undefined;

    let ctx;

    const mount = () => {
      ctx?.revert();
      killTimelines();
      ctx = gsap.context(() => {
        setupScrollAnimations();
      }, rootRef);
    };

    mount();
    requestAnimationFrame(() => ScrollTrigger.refresh());

    const onResize = () => {
      mount();
      ScrollTrigger.refresh();
    };

    window.addEventListener('aurora:resize', onResize);

    return () => {
      window.removeEventListener('aurora:resize', onResize);
      killTimelines();
      ctx?.revert();
    };
  }, [isMobile]);

  useEffect(() => {
    const videoEl = videoElRef.current;
    if (!shouldLoad || !videoEl) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) videoEl.play().catch(() => {});
        else videoEl.pause();
      },
      { threshold: 0.5 }
    );
    observer.observe(videoEl);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const openFullscreen = () => {
    fullscreenRef.current = true;
    setFullscreen(true);
    const targetY = window.innerHeight * 3;
    if (lenis?.scrollTo) {
      lenis.scrollTo(targetY, { duration: 1.15, easing: (t) => 1 - (1 - t) ** 3 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
    gsap.to(['.home-video--container', '.home-title'], {
      autoAlpha: 0,
      duration: 0.5,
      ease: 'quart.out',
    });
    if (videoElRef.current) {
      videoElRef.current.controls = true;
      videoElRef.current.muted = false;
    }
    lenis?.stop();
  };

  const closeFullscreen = () => {
    fullscreenRef.current = false;
    setFullscreen(false);
    const exitActive = ScrollTrigger.getById('home-video-exit')?.isActive;
    gsap.to(['.home-video--container', '.home-title'], {
      autoAlpha: exitActive ? 0 : 1,
      duration: 0.5,
      ease: 'quart.out',
    });
    if (videoElRef.current) {
      videoElRef.current.controls = false;
      videoElRef.current.muted = true;
      videoElRef.current.play().catch(() => {});
    }
    lenis?.start();
  };

  return (
    <>
      <section
        className={`home-video${fullscreen ? ' video--fullscreen' : ''}`}
        ref={setRootRef}
      >
        <div className="video-mask">
          <div className="video-mask-item">
            {shouldLoad && video && (
              <video
                src={video}
                loop
                muted
                playsInline
                preload="auto"
                ref={videoElRef}
              />
            )}
          </div>
          <AuroraSymbolOutline
            className="home-video-symbol-outline"
            strokeWidth={1}
            aria-hidden
          />
        </div>
        {fullscreen && <CloseBtnCenter onClick={closeFullscreen} />}
        <div className="home-video--container">
          <div className="big-title" onClick={openFullscreen} role="presentation">
            {!isMobile && <span>{firstTitle}</span>}
            <CircleBtn blur={10} />
            <span>
              {isMobile && firstTitle ? `${firstTitle} ` : ' '}
              {secondTitle}
            </span>
          </div>
          <p>{description}</p>
        </div>
      </section>
      {showTitle && (
        <HomeTitle delay={titleDelayInstant ? 0 : 0.5} duration={1.25}>
          {title}
        </HomeTitle>
      )}
    </>
  );
}
