'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import { useApp } from '@/context/AppContext';
import Logo from '@/components/icons/Logo';

/**
 * Site header (original Header.vue / data-v-451ea45a).
 * Fixed top bar, logo left, gradient menu trigger right.
 */
export default function Header({ errorLayout: errorLayoutProp }) {
  const rootRef = useRef(null);
  const pathname = usePathname();
  const { menuOpen, toggleMenu } = useApp();

  const errorLayout =
    errorLayoutProp ?? (!pathname || pathname.includes('error'));

  useEffect(() => {
    if (!rootRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, {
        opacity: 0,
        duration: 2,
        delay: 0.25,
        ease: 'quart.out',
        clearProps: 'all',
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleMenuClick = () => {
    const menuBtn = rootRef.current?.querySelector('.menu');
    if (menuBtn) {
      gsap.to(menuBtn, {
        duration: 0.15,
        scale: 0.9,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
    }
    toggleMenu();
  };

  return (
    <header
      className={`header${errorLayout ? ' -error-layout' : ''}`}
      ref={rootRef}
    >
      <div className="header-left">
        <Link href="/">
          <Logo className="Icon no-size" />
        </Link>
      </div>
      {!errorLayout && (
        <ul className="header-right">
          <li>
            <button
              type="button"
              className={menuOpen ? 'menu -menu-open' : 'menu'}
              onClick={handleMenuClick}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="header-icon">
                <span />
                <span />
              </div>
            </button>
          </li>
        </ul>
      )}
    </header>
  );
}
