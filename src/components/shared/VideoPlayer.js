'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useApp } from '@/context/AppContext';

function CloseBtn({ position }) {
  return (
    <div className={`close ${position ? `close--${position}` : ''}`.trim()}>
      <div className="close-background" />
      <div className="close-item">
        <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <line x1="1" y1="11" x2="11" y2="1" stroke="currentColor" strokeWidth="2" />
          <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

export default function VideoPlayer({ src, onClose }) {
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const { lenis } = useApp();

  useEffect(() => {
    headerRef.current = document.querySelector('.header');
    lenis?.stop();

    if (headerRef.current) {
      headerRef.current.style.zIndex = '2';
    }

    const q = gsap.utils.selector(rootRef.current);
    gsap
      .timeline()
      .from(
        q('video'),
        {
          clipPath: 'inset(50% 50% 50% 50%)',
          scale: 0,
          duration: 1,
          ease: 'elastic.out(0.4, 0.4)',
          clearProps: 'all',
        },
        0
      )
      .from(q('.video-player--bg'), { opacity: 0, duration: 0.5, ease: 'quart.out', clearProps: 'all' }, 0)
      .from('.close', { scale: 0, duration: 0.5, ease: 'quart.out', clearProps: 'all' }, 0);

    return () => {
      lenis?.start();
      if (headerRef.current) {
        headerRef.current.style.zIndex = '';
      }
    };
  }, [lenis]);

  const handleClose = () => {
    const q = gsap.utils.selector(rootRef.current);
    gsap
      .timeline({
        onComplete: () => onClose?.(),
      })
      .to(q('video'), { clipPath: 'inset(50% 50% 50% 50%)', scale: 0.75, opacity: 0, duration: 0.5, ease: 'quart.inOut' }, 0)
      .to(q('.video-player--bg'), { opacity: 0, duration: 0.5, ease: 'quart.inOut' }, 0)
      .to('.close', { scale: 0, duration: 0.5, ease: 'quart.inOut' }, 0);
  };

  const onClick = (e) => {
    if (e.target.tagName === 'VIDEO') return;
    handleClose();
  };

  return (
    <div className="video-player" onClick={onClick} ref={rootRef} role="dialog" aria-modal>
      <CloseBtn position="center" />
      <div className="video-player--bg" />
      <video muted autoPlay playsInline>
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
