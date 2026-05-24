import { gsap } from '@/lib/gsap';

/** Single trail image — matches reference DsLZz9Xl Image class. */
class TrailImage {
  constructor(el) {
    this.DOM = {
      el,
      inner: el.querySelector('.content__img-inner'),
    };
    this.rect = null;
    this.timeline = null;
    this.getRect();
  }

  getRect() {
    if (this.DOM.el) {
      this.rect = this.DOM.el.getBoundingClientRect();
    }
  }

  destroy() {
    this.timeline?.kill();
  }
}

/**
 * Cursor image trail — matches reference DsLZz9Xl default export.
 * Pre-rendered `.content__img` nodes cycle on pointer movement.
 */
export class ImagesTrailEffect {
  constructor(el) {
    this.DOM = { el };
    const nodes = this.DOM.el.querySelectorAll('.content__img');
    this.images = [...nodes].map((node) => (node ? new TrailImage(node) : null)).filter(Boolean);
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 120;
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { ...this.mousePos };
    this.rAF = null;

    this.initPointerEvents();
    this.initResizeEvent();

    const startRender = () => {
      this.cacheMousePos = { ...this.mousePos };
      this.rAF = requestAnimationFrame(() => this.render());
      this.DOM.el.removeEventListener('mousemove', startRender);
      this.DOM.el.removeEventListener('touchmove', startRender);
    };
    this.DOM.el.addEventListener('mousemove', startRender);
    this.DOM.el.addEventListener('touchmove', startRender);
  }

  initPointerEvents() {
    this.handlePointerMove = (ev) => {
      this.mousePos = ev.touches ? this.getPointerPos(ev.touches[0]) : this.getPointerPos(ev);
    };
    this.DOM.el.addEventListener('mousemove', this.handlePointerMove);
    this.DOM.el.addEventListener('touchmove', this.handlePointerMove);
  }

  initResizeEvent() {
    this.resize = () => {
      gsap.set(this.DOM.el, { scale: 1, x: 0, y: 0 });
      this.images.forEach((img) => img.getRect());
    };
    window.addEventListener('resize', this.resize);
  }

  getPointerPos(e) {
    const rect = this.DOM.el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  render() {
    const dist = this.getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = this.lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = this.lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (dist > this.threshold) {
      this.showNextImage();
      this.lastMousePos = this.mousePos;
    }

    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }

    this.rAF = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    this.zIndexVal += 1;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;

    const image = this.images[this.imgPosition];
    if (!image?.DOM.el) return;

    gsap.killTweensOf(image.DOM.el);

    const bounds = this.DOM.el.getBoundingClientRect();
    const halfW = image.rect.width / 2;
    const halfH = image.rect.height / 2;

    const cacheX = this.clamp(this.cacheMousePos.x - halfW, 0, bounds.width - image.rect.width);
    const cacheY = this.clamp(this.cacheMousePos.y - halfH, 0, bounds.height - image.rect.height);
    const mouseX = this.clamp(this.mousePos.x - halfW, 0, bounds.width - image.rect.width);
    const mouseY = this.clamp(this.mousePos.y - halfH, 0, bounds.height - image.rect.height);

    image.timeline = gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .addLabel('start', 0)
      .fromTo(
        image.DOM.el,
        { opacity: 1, scale: 0, zIndex: this.zIndexVal, x: cacheX, y: cacheY },
        { duration: 0.4, scale: 1, x: mouseX, y: mouseY, ease: 'power1' },
        'start'
      )
      .fromTo(
        image.DOM.inner,
        { scale: 2.8 },
        { scale: 1, duration: 0.4, ease: 'power1' },
        'start'
      )
      .to(image.DOM.el, { opacity: 0, scale: 0.2, duration: 0.4, ease: 'power2' }, 0.6);
  }

  getMouseDistance(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  lerp(start, end, factor) {
    return (1 - factor) * start + factor * end;
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  onImageActivated() {
    this.activeImagesCount += 1;
    this.isIdle = false;
  }

  onImageDeactivated() {
    this.activeImagesCount -= 1;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }

  destroy() {
    if (this.rAF) cancelAnimationFrame(this.rAF);
    this.DOM.el.removeEventListener('mousemove', this.handlePointerMove);
    this.DOM.el.removeEventListener('touchmove', this.handlePointerMove);
    window.removeEventListener('resize', this.resize);
    this.images.forEach((img) => img.destroy());
  }
}
