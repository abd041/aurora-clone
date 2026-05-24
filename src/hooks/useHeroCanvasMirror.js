/**
 * Mirrored hero video canvas — B0iSZM4m.js (HomeHero).
 */
export function attachHeroCanvasMirror(video, container) {
  if (!video || !container) return () => {};

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  Object.assign(canvas.style, {
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    position: 'fixed',
    inset: '0',
    transform: 'scaleX(-1)',
  });

  container.appendChild(canvas);

  let rafId = 0;

  const drawFrame = () => {
    if (video.readyState >= 2 && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  };

  const draw = () => {
    drawFrame();
    rafId = requestAnimationFrame(draw);
  };

  const start = () => {
    cancelAnimationFrame(rafId);
    draw();
  };

  video.addEventListener('loadeddata', start);
  video.addEventListener('seeked', drawFrame);
  if (video.readyState >= 2) start();

  return () => {
    cancelAnimationFrame(rafId);
    video.removeEventListener('loadeddata', start);
    video.removeEventListener('seeked', drawFrame);
    canvas.remove();
  };
}
