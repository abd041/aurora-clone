'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppProvider as AppContextProvider, useApp } from '@/context/AppContext';
import LenisProvider from '@/components/providers/LenisProvider';
import Header from '@/components/layout/Header';
import MenuTransition from '@/components/layout/MenuTransition';
import Footer from '@/components/layout/Footer';
import Intro from '@/components/layout/Intro';
import CustomCursor from '@/components/ui/CustomCursor';
import { ScrollTrigger } from '@/lib/gsap';
import { initDevice } from '@/lib/device';

function AppShell({ children }) {
  const pathname = usePathname();
  const { inIntro, menuOpen, loaded, setLoaded, completeIntro } = useApp();
  const menuOpenClass = menuOpen ? ' app--menu-open' : '';
  const [pageClass, setPageClass] = useState('');
  const isFirstRoute = useRef(true);

  const isErrorLayout = !pathname || pathname.includes('error');
  const showFooterDescription =
    pathname !== '/' && pathname !== '/agence';
  const showCustomCursor = pathname === '/agence';

  useEffect(() => {
    initDevice();
    let done = false;
    const ready = () => {
      if (done) return;
      done = true;
      setLoaded(true);
    };
    const timeout = setTimeout(ready, 2500);
    if (document.fonts?.ready) {
      document.fonts.ready.then(ready).catch(ready);
    } else {
      ready();
    }
    return () => clearTimeout(timeout);
  }, [setLoaded]);

  useEffect(() => {
    const skipIntro = () => completeIntro();
    window.addEventListener('aurora:skipIntro', skipIntro);
    return () => window.removeEventListener('aurora:skipIntro', skipIntro);
  }, [completeIntro]);

  useEffect(() => {
    if (inIntro) return;

    window.scrollTo(0, 0);

    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      const timer = setTimeout(() => {
        ScrollTrigger.refresh(true);
        window.dispatchEvent(new CustomEvent('aurora:pageEnter'));
        window.dispatchEvent(new CustomEvent('aurora:pageEnterCompleted'));
      }, 100);
      return () => clearTimeout(timer);
    }

    setPageClass('page-enter page-enter-active');
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPageClass('page-enter-active');
      });
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
      window.dispatchEvent(new CustomEvent('aurora:pageEnter'));
      window.dispatchEvent(new CustomEvent('aurora:pageEnterCompleted'));
      setPageClass('');
    }, 300);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [pathname, inIntro]);

  return (
    <div
      className={`app route--${pathname?.replace(/^\//, '') || 'index'}${loaded ? '' : ' app--booting'}${menuOpenClass}`}
    >
      {inIntro && <Intro />}
      {!inIntro && <Header errorLayout={isErrorLayout} />}
      <MenuTransition open={menuOpen} />
      <div className={`page-wrapper${pageClass ? ` ${pageClass}` : ''}`}>{children}</div>
      {!inIntro && <Footer isDescription={showFooterDescription} />}
      {!inIntro && showCustomCursor && <CustomCursor />}
    </div>
  );
}

export default function AppProvider({ children }) {
  return (
    <AppContextProvider>
      <LenisProvider>
        <AppShell>{children}</AppShell>
      </LenisProvider>
    </AppContextProvider>
  );
}
