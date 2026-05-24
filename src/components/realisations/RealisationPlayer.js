'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

export default function RealisationPlayer({ videoUrl }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const animateDrawSvg = () => {
    gsap.from('.realisation-player .draw-svg', {
      drawSVG: '0%',
      stagger: 0.1,
      duration: 1,
      delay: 0.1,
      ease: 'quart.out',
      clearProps: 'all',
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const onPlay = () => setPlaying(true);
    const onPause = async () => {
      setPlaying(false);
      await new Promise((r) => requestAnimationFrame(r));
      animateDrawSvg();
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  const toggle = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      await video.play();
    }
  };

  if (!videoUrl) return null;

  return (
    <section
      className={`realisation-player realisation-component${playing ? '' : ' video-pause'}`}
      onClick={toggle}
      role="presentation"
    >
      <video ref={videoRef} src={videoUrl} playsInline preload="metadata" />
      {!playing && (
        <div className="player-pause">
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle
              className="draw-svg"
              cx="80"
              cy="80"
              r="79.25"
              stroke="url(#paint0_linear_player)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              className="draw-svg"
              fill="none"
              d="M87.979 77.3083C89.6629 78.7077 89.6628 81.2923 87.979 82.6917L77.8366 91.1211C75.5561 93.0164 72.0995 91.3946 72.0995 88.4293L72.0995 71.5707C72.0995 68.6054 75.5561 66.9836 77.8366 68.8789L87.979 77.3083Z"
              stroke="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_player"
                x1="132"
                y1="28"
                x2="27.5"
                y2="132.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F3C4C9" />
                <stop offset="1" stopColor="#977DBD" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </section>
  );
}
