'use client';

import { useCallback, useEffect, useState } from 'react';
import { getDeviceState, initDevice, refreshDevice } from '@/lib/device';

export function useIsDesktop() {
  const [desktop, setDesktop] = useState(true);

  const update = useCallback(() => {
    refreshDevice();
    setDesktop(getDeviceState().isDesktop);
  }, []);

  useEffect(() => {
    initDevice();
    update();
    window.addEventListener('resize', update);
    window.addEventListener('aurora:resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('aurora:resize', update);
    };
  }, [update]);

  return desktop;
}

export default useIsDesktop;
