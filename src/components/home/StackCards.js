'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import CircleBtn from '@/components/ui/CircleBtn';
import VideoPlayer from '@/components/shared/VideoPlayer';
import useIsMobile from '@/hooks/useIsMobile';
import useLazyInView from '@/hooks/useLazyInView';
import { MARINA_COLORS } from '@/lib/marinaMotion';

const DESC_LIMIT = 150;

export default function StackCards({ cards = [] }) {
  const containerRef = useRef(null);
  const { ref: lazyRef, shouldLoad } = useLazyInView({ rootMargin: '400px' });
  const isMobile = useIsMobile();
  const videoRefs = useRef([]);
  const observersRef = useRef([]);
  const loadedVideos = useRef(new Set());

  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerSrc, setPlayerSrc] = useState('');
  const [expanded, setExpanded] = useState(false);

  const setContainerRef = (node) => {
    containerRef.current = node;
    lazyRef.current = node;
  };

  const markVideoLoaded = (index) => {
    if (!loadedVideos.current.has(index)) {
      loadedVideos.current.add(index);
      observeVideo(index);
    }
  };

  const observeVideo = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    observersRef.current.push(observer);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const cardEls = [...containerRef.current.querySelectorAll('.card')];
    const count = cardEls.length;

    cardEls.forEach((card, index) => {
      if (index === count - 1) {
        gsap.set(card, { scale: 1, opacity: 1, yPercent: 0 });
        return;
      }
      gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'center center',
          end: '+=100%',
          scrub: true,
        },
        defaults: { ease: 'none' },
      }).to(
        card,
        {
          '--hide-opacity': 1,
          '--default-opacity': 0,
          scale: 0.9,
          backgroundColor: MARINA_COLORS.secondary,
        },
        0
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (cardEls.includes(st.trigger)) st.kill();
      });
    };
  }, [cards.length]);

  useEffect(
    () => () => {
      observersRef.current.forEach((o) => o.disconnect());
      observersRef.current = [];
    },
    []
  );

  const openPlayer = (e) => {
    const src = e.currentTarget?.dataset?.src;
    if (src) {
      setPlayerSrc(src);
      setPlayerOpen(true);
    }
  };

  const truncate = (text = '') => {
    const t = String(text);
    return t.length > DESC_LIMIT ? t.slice(0, DESC_LIMIT) : t;
  };

  const needsMore = (text = '') => String(text).length > DESC_LIMIT;

  return (
    <>
      <div className="stack-cards" ref={setContainerRef}>
        {cards.map((card, index) => (
          <div className="card" key={card._key || index}>
            <div className="card-profile">
              <div className="profile-img">
                {card.video?.url && shouldLoad && (
                  <video
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[index] = el;
                        markVideoLoaded(index);
                      }
                    }}
                    src={card.video.url}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                )}
              </div>
              <div className="play-btn" onClick={openPlayer}>
                <CircleBtn data-src={card.video?.url || ''} color="white" blur={10} />
              </div>
            </div>
            <div className="card-text">
              <span className="card-category category">{card.categorie}</span>
              <div className="card-text-container">
                <h3 dangerouslySetInnerHTML={{ __html: card.titre }} />
                {card.subtitle && <h4>{card.subtitle}</h4>}
                {!isMobile && card.description && <p>{card.description}</p>}
                {isMobile && card.description && (
                  <p>
                    {expanded ? card.description : truncate(card.description)}
                    {needsMore(card.description) && !expanded && '…'}
                    {needsMore(card.description) && (
                      <button type="button" onClick={() => setExpanded((v) => !v)}>
                        {expanded ? 'See less' : 'See more'}
                      </button>
                    )}
                  </p>
                )}
                {Array.isArray(card.liste_de_tags) && (
                  <ul className="tags">
                    {card.liste_de_tags.map((tag) => (
                      <li className="tag" key={tag._key || tag.tag}>
                        {tag.tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {playerOpen && <VideoPlayer src={playerSrc} onClose={() => setPlayerOpen(false)} />}
    </>
  );
}
