'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import { useApp } from '@/context/AppContext';
import { menuItems, menuDescription, menuContact, site } from '@/data/site';
import useIsMobile from '@/hooks/useIsMobile';
import { useSplitLines } from '@/hooks/useSplitLines';
import { MARINA_COLORS, MARINA_DURATION, MARINA_EASE } from '@/lib/marinaMotion';

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
  }, [lenis]);

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

    const fastOpen = isMobile;
    const openDuration = fastOpen ? 0.55 : 0.75;
    const linkStagger = fastOpen ? 0.06 : 0.1;

    tl.addLabel('start')
      .from(q('.menu-background'), {
        opacity: 0,
        duration: openDuration,
        ease: 'quart.out',
        clearProps: 'all',
      }, 'start')
      .from(q('li a'), {
        yPercent: 100,
        stagger: linkStagger,
        duration: openDuration,
        ease: 'quart.out',
        clearProps: 'all',
      }, 'start+=0.15');
  };

  const handleLinkClick = () => {
    setTimeout(() => {
      if (!navigatingRef.current) {
        toggleMenu();
      }
    }, 500);
  };

  const handleListEnter = () => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    gsap.to('.menu-list li', {
      color: MARINA_COLORS.primary,
      duration: MARINA_DURATION.fast,
      ease: MARINA_EASE.out,
    });
  };

  const handleListLeave = () => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    gsap.to('.menu-list li', {
      clearProps: 'color',
      duration: MARINA_DURATION.fast,
      ease: MARINA_EASE.out,
    });
  };

  return (
    <div className="menu page" ref={rootRef}>
      <div className="menu-background">
        {isMobile ? (
          <img src={site.assets.menuBgMobile} alt="" />
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
          <MenuDescription>{menuDescription}</MenuDescription>
        </div>
        <ul className="menu-contact">
          {menuContact.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="link hide-u" onClick={handleLinkClick}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
