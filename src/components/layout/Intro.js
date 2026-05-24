'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useApp } from '@/context/AppContext';
import useIsMobile from '@/hooks/useIsMobile';

const LOGO_INTRO = '/_nuxt/logo-intro.FMLjELMt.png';
const INTRO_BG_MOBILE = '/_nuxt/intro-bg-mobile.goTljaNO.png';

export default function Intro() {
  const rootRef = useRef(null);
  const isMobile = useIsMobile();
  const { completeIntro } = useApp();

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        completeIntro();
        window.dispatchEvent(new CustomEvent('aurora:introCompleted'));
      },
    });

    tl.addLabel('start', '+=0.5')
      .from('.intro-logo--item', {
        scale: 2,
        yPercent: 100,
        duration: 2,
        ease: 'quart.out',
        clearProps: 'all',
      }, 'start')
      .to('.intro-container', {
        opacity: 0,
        duration: 0.6,
        ease: 'quart.inOut',
      }, 'start+=2.5')
      .to(rootRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'quart.inOut',
      }, 'start+=2.75');

    const skipIntro = () => {
      tl.progress(1);
      completeIntro();
    };

    window.addEventListener('aurora:skipIntro', skipIntro);

    return () => {
      window.removeEventListener('aurora:skipIntro', skipIntro);
      tl.kill();
    };
  }, [completeIntro]);

  return (
    <div className="intro" ref={rootRef}>
      <div className="intro-background">
        {isMobile ? (
          <img src={INTRO_BG_MOBILE} alt="" />
        ) : (
          <>
            <div className="intro-bg intro-bg--01" />
            <div className="intro-bg intro-bg--02" />
            <div className="intro-bg intro-bg--03" />
            <div className="intro-bg intro-bg--04" />
          </>
        )}
      </div>
      <div className="intro-container">
        <div className="intro-logo">
          <img
            src={LOGO_INTRO}
            className="intro-logo--item"
            alt="Logo"
          />
        </div>
      </div>
    </div>
  );
}
