/**
 * CONTACT PAGE (/contact) — background image & scrolling photo trail.
 * Form labels live in src/data/site.js → contactForm.
 */

const trailImages = [
  '/images/trail/fc8155e72194d67e4f092ac0aa47bf55236fee6a-1536x1024.avif',
  '/images/trail/2aa8e0b25437531f2074965dc10ad17071c2cba4-1536x1024.avif',
  '/images/trail/8da78459aa27db552f67bd2746ce8a4e6c397089-1536x1024.avif',
  '/images/trail/8de6ffb2b95033cdd0df8141283815ca5bda0215-1536x1024.avif',
  '/images/trail/22b8a35d0b046b2dd610a7ebc99650b2f4b48f98-1536x1024.avif',
  '/images/trail/43dc3afd57cd9b1963e224b308c4a16f205f4ff5-1536x1024.avif',
  '/images/trail/194b971545c72ea32b1e9a7c83c99e198e7a028a-1536x1024.avif',
  '/images/trail/a3ea6688a30897880e9782356ae1e78dc6be0541-1536x1024.avif',
  '/images/trail/b43eb0db2bb25a4154a5d83599f779a5e517169d-1536x1024.avif',
  '/images/trail/ba7930c806d5f46782cd20dd1ca2a1833e8aae49-1536x1024.avif',
  '/images/trail/bd74064b3ddb255773f234d293a095c1a6940d80-1536x1024.avif',
  '/images/trail/cbd4145f41d1f0a503b829ba4aca6286c3e3b980-1536x1024.avif',
  '/images/trail/da3bdbb291cc9fbc481a6c9a779755225b8715fb-1536x1024.avif',
  '/images/trail/e2bcd938cb302e64e1fdf702fa66c87c981a8287-1536x1024.avif',
  '/images/trail/edd993f89eb5a0fbf6611c4b13470e1d644eacb3-1536x1024.avif',
  '/images/trail/efdc72a09d043646e6153c77104a0a046264ca97-1536x1024.avif',
  '/images/trail/f329b922e822a4c6e1929e0dd23ab82931249981-1536x1024.avif',
  '/images/trail/fd660f08b7f4cd395ddfeb7683c0572b20189b7a-1536x1024.avif',
];

export const contact = {
  contact_title: null,
  contact_description: null,
  contact_steps: null,
  contact_background: '/images/f329b922e822a4c6e1929e0dd23ab82931249981-1536x1024.avif',
  contact_images_trail: trailImages.map((contact_image) => ({ contact_image })),
};
