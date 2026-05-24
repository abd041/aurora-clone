'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import { useApp } from '@/context/AppContext';
import { menuItems, menuDescription } from '@/data/content';
import useIsMobile from '@/hooks/useIsMobile';
import { useSplitLines } from '@/hooks/useSplitLines';

const MENU_BG_MOBILE = '/_nuxt/intro-bg-mobile.goTljaNO.png';

const MENU_DESCRIPTION =
  menuDescription ||
  "This project was originally a real project for an agency. Unfortunately, the visual and written content didn't meet the studio's standards, so we decided to release the website under a different name in order to showcase the project.";

function MenuDescription({ children }) {
  const ref = useRef(null);
  useSplitLines(ref, { delay: 0.4, animated: true, auto: true });
  return <p ref={ref}>{children}</p>;
}

/**
 * Full-screen menu overlay (original Menu.vue / data-v-b22133a4).
 */
export default function Menu() {
  const rootRef = useRef(null);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { lenis, closeMenu, toggleMenu } = useApp();
  const navigatingRef = useRef(false);
  const timelineRef = useRef(null);
  const prevPathRef = useRef(null);

  useEffect(() => {
    lenis?.stop();
    runOpenAnimation();

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      lenis?.start();
    };
  }, [lenis, isMobile]);

  useEffect(() => {
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      return undefined;
    }
    if (prevPathRef.current === pathname) {
      return undefined;
    }
    prevPathRef.current = pathname;
    navigatingRef.current = true;
    closeMenu();
    const timer = setTimeout(() => {
      navigatingRef.current = false;
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname, closeMenu]);

  const runOpenAnimation = async () => {
    if (!rootRef.current) return;

    gsap.killTweensOf(rootRef.current);
    await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(r));

    const q = gsap.utils.selector(rootRef.current);
    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.addLabel('start')
      .from(q('.menu-background'), {
        opacity: 0,
        duration: 0.75,
        ease: 'quart.out',
        clearProps: 'all',
      }, 'start')
      .from(q('li a'), {
        yPercent: 100,
        stagger: 0.1,
        duration: 0.75,
        ease: 'quart.out',
        clearProps: 'all',
      }, 'start+=0.2');
  };

  const handleLinkClick = () => {
    setTimeout(() => {
      if (!navigatingRef.current) {
        toggleMenu();
      }
    }, 500);
  };

  const handleListEnter = () => {
    gsap.to('.menu-list li', {
      color: '#977DBD',
      duration: 0.25,
      ease: 'quart.out',
    });
  };

  const handleListLeave = () => {
    gsap.to('.menu-list li', {
      color: '#F3C4C9',
      duration: 0.25,
      ease: 'quart.out',
      clearProps: 'all',
    });
  };

  return (
    <div className="menu page" ref={rootRef}>
      <div className="menu-background">
        {isMobile ? (
          <img src={MENU_BG_MOBILE} alt="" />
        ) : (
          <>
            <div className="menu-bg menu-bg--01" />
            <div className="menu-bg menu-bg--02" />
            <div className="menu-bg menu-bg--03" />
            <div className="menu-bg menu-bg--04" />
          </>
        )}
      </div>

      <div className="menu-container">
        <div
          className="menu-list"
          onMouseEnter={handleListEnter}
          onMouseLeave={handleListLeave}
        >
          <ul>
            {menuItems.map((item) => (
              <li className="o-hidden" key={item.to}>
                <Link href={item.to} onClick={handleLinkClick}>
                  {item.titre}
                </Link>
              </li>
            ))}
          </ul>
          <MenuDescription>{MENU_DESCRIPTION}</MenuDescription>
        </div>
      </div>
    </div>
  );
}
