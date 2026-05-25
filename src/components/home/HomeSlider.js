'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import HomeTitle from '@/components/home/HomeTitle';
import useIsMobile from '@/hooks/useIsMobile';
import { sharedUi } from '@/data/content';

const SLIDER_INTERVAL = 4;

export default function HomeSlider({ realisations = [] }) {
  const rootRef = useRef(null);
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState(() => new Set([0]));
  const intervalRef = useRef(null);
  const lockRef = useRef(false);
  const ctxRef = useRef(null);
  const enterCtxRef = useRef(null);
  const isMobile = useIsMobile();

  const items = Array.isArray(realisations) ? realisations.filter(Boolean) : [];
  const current = items[index] || null;

  const coverUrl = (item) =>
    item?.acf?.realisation_cover?.url ||
    item?.highlightCover ||
    item?.acf?.realisation_cover;

  useEffect(() => {
    if (!items.length) return;
    const len = items.length;
    const prev = (index - 1 + len) % len;
    const next = (index + 1) % len;
    setLoadedSlides((s) => {
      const nextSet = new Set(s);
      nextSet.add(index);
      nextSet.add(prev);
      nextSet.add(next);
      return nextSet;
    });
  }, [index, items.length]);

  const shouldRenderSlide = (i) => loadedSlides.has(i);

  const stopSliderInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startInterval = () => {
    stopSliderInterval();
    if (!items.length) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, SLIDER_INTERVAL * 1000);
  };

  const goTo = (i) => {
    if (lockRef.current || !items.length || i === index) return;
    lockRef.current = true;
    setPrevIndex(index);
    setIndex(Math.max(0, Math.min(i, items.length - 1)));
    startInterval();
    setTimeout(() => {
      lockRef.current = false;
    }, isMobile ? 720 : 1000);
  };

  const menuAnimationStyle = (i) => {
    if (i !== index) return undefined;
    return { animation: `sliderText ${SLIDER_INTERVAL}s linear` };
  };

  const runEnterAnimation = () => {
    if (!rootRef.current) return;
    enterCtxRef.current?.revert?.();
    enterCtxRef.current = gsap.context(() => {
      const q = gsap.utils.selector(rootRef.current);
      const btnEase = isMobile ? 'power2.out' : 'elastic.out(0.4, 0.3)';
      const btnDuration = isMobile ? 0.65 : 1;
      gsap
        .timeline()
        .from(q('.slider-btn'), {
          scale: isMobile ? 0.85 : 0,
          duration: btnDuration,
          ease: btnEase,
          clearProps: 'all',
        }, 0.08)
        .from(q('.slider-menu li'), {
          autoAlpha: 0,
          scale: isMobile ? 0.92 : 0,
          stagger: isMobile ? 0.06 : 0.1,
          duration: isMobile ? 0.6 : 1,
          ease: 'quart.out',
          clearProps: 'all',
        }, 0);
    }, rootRef);
  };

  useEffect(() => {
    if (!rootRef.current || !items.length) return undefined;

    ctxRef.current = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: false,
          toggleActions: 'play none restart reset',
          onLeave: () => {
            setIndex(0);
            setActive(false);
            stopSliderInterval();
          },
          onLeaveBack: () => {
            setIndex(0);
            setActive(false);
            stopSliderInterval();
          },
          onEnter: () => {
            setIndex(0);
            setActive(true);
            startInterval();
            runEnterAnimation();
          },
          onEnterBack: () => {
            setIndex(0);
            setActive(true);
            startInterval();
            runEnterAnimation();
          },
        },
      }).from(rootRef.current, { opacity: 0, duration: 0.5, ease: 'quart.out', clearProps: 'all' });
    }, rootRef);

    return () => {
      ctxRef.current?.revert?.();
      enterCtxRef.current?.revert?.();
      stopSliderInterval();
    };
  }, [items.length]);

  useEffect(() => {
    if (!items.length) {
      stopSliderInterval();
      setIndex(0);
    }
  }, [items.length]);

  useEffect(() => {
    if (active && items.length) startInterval();
    else stopSliderInterval();
  }, [active, items.length]);

  if (!items.length) return null;

  return (
    <div className="home-slider" ref={rootRef}>
      <div className="slider-bg">
        <div className="fade-bg" />
        {items.map((item, i) =>
          shouldRenderSlide(i) ? (
            <img
              key={item.slug || i}
              className={`slider-bg-img${prevIndex === i ? ' prev' : ''}${index === i ? ' active' : ''}`}
              src={coverUrl(item)}
              alt={item.title || ''}
            />
          ) : null
        )}
      </div>
      {active && (
        <div className="slider-container">
          <span className="slider-category category uppercase">
            {(current?.categories || []).map((cat, ci) => (
              <span key={ci}>
                {ci > 0 ? ', ' : ''}
                {cat}
              </span>
            ))}
          </span>
          <HomeTitle
            tag="h2"
            className="title t-center"
            key={index}
            delay={0.75}
          >
            {current?.title || 'Réalisation'}
          </HomeTitle>
          <div className="slider-btn">
            <Link href={`/realisations/${current?.slug || ''}`}>{sharedUi.sliderCta}</Link>
          </div>
          <ul className="slider-menu">
            {items.map((item, i) => (
              <li
                key={item.slug || i}
                className={index === i ? 'active' : ''}
                onClick={() => goTo(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goTo(i);
                  }
                }}
                style={menuAnimationStyle(i)}
                role="button"
                tabIndex={0}
                aria-current={index === i ? 'true' : undefined}
                aria-label={item.title || 'Réalisation'}
              >
                {item.title || 'Réalisation'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
