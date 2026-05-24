'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [inIntro, setInIntro] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lenis, setLenis] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => !open);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const completeIntro = useCallback(() => {
    setInIntro(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:introCompleted'));
    }
  }, []);

  const value = useMemo(
    () => ({
      inIntro,
      setInIntro,
      menuOpen,
      setMenuOpen,
      toggleMenu,
      closeMenu,
      lenis,
      setLenis,
      loaded,
      setLoaded,
      completeIntro,
    }),
    [inIntro, menuOpen, lenis, loaded, toggleMenu, closeMenu, completeIntro]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}

export default AppContext;
