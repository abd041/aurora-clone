'use client';

import { useCallback, useEffect, useState } from 'react';
import { getDeviceState, initDevice, isMobile as getIsMobile, refreshDevice } from '@/lib/device';

export function useIsMobile() {
  // Stable false on server + first client paint — updated after mount in useEffect.
  const [mobile, setMobile] = useState(false);

  const update = useCallback(() => {
    refreshDevice();
    setMobile(getDeviceState().isMobile);
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

  return mobile;
}

export default useIsMobile;
