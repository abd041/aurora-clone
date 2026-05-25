/**
 * WORKS / PROJECTS (/realisations) — portfolio & homepage slider.
 *
 * To add a project:
 *  1. Copy an existing buildProject({ ... }) block
 *  2. Set a unique slug (used in the URL: /realisations/your-slug)
 *  3. Update title, cover, gallery paths
 *  4. Place images in /public/images/realisations/
 */

import { buildProject } from './helpers.js';

export const realisations = [
  buildProject({
    slug: 'kruger-nyota-resort',
    title: 'Kruger Nyota Resort',
    cover: '/images/realisations/real_0_cover.webp',
    coverType: 'image',
    gallery: [
      '/images/realisations/real_0_gallery_0.webp',
      '/images/realisations/real_0_gallery_1.webp',
      '/images/realisations/real_0_gallery_2.webp',
      '/images/realisations/real_0_gallery_3.webp',
    ],
    stats: [
      ['+27%', 'Additional income'],
      ['2025', 'Project year'],
      ['+48%', 'Web & social traffic'],
    ],
  }),
  buildProject({
    slug: 'serengeti-haven',
    title: 'Serengeti Haven',
    cover: '/images/realisations/real_1_cover.webp',
    coverType: 'image',
    gallery: [
      '/images/realisations/real_1_gallery_0.webp',
      '/images/realisations/real_1_gallery_1.webp',
      '/images/realisations/real_1_gallery_2.webp',
      '/images/realisations/real_1_gallery_3.webp',
    ],
    stats: [
      ['+24% ', 'Additional income'],
      ['2025', 'Project year'],
      ['+60%', 'Web & Social traffic'],
    ],
  }),
  buildProject({
    slug: 'flinders-dunes',
    title: 'Flinders Dunes',
    cover: '/images/realisations/real_2_cover.webp',
    coverType: 'video',
    gallery: [
      '/images/realisations/real_2_gallery_0.webp',
      '/images/realisations/real_2_gallery_1.webp',
      '/images/realisations/real_2_gallery_2.webp',
      '/images/realisations/real_2_gallery_3.webp',
    ],
    videoUrl: null,
  }),
  buildProject({
    slug: 'hudson-bay-lodge',
    title: 'Hudson Bay Lodge',
    cover: '/images/realisations/real_3_cover.webp',
    coverType: 'video',
    gallery: [
      '/images/realisations/real_3_gallery_0.webp',
      '/images/realisations/real_3_gallery_1.webp',
      '/images/realisations/real_3_gallery_2.webp',
      '/images/realisations/real_3_gallery_3.webp',
    ],
  }),
  buildProject({
    slug: 'eden-al-zahra',
    title: 'Eden Al Zahra',
    cover: '/images/realisations/real_4_cover.webp',
    coverType: 'video',
    gallery: [
      '/images/realisations/real_4_gallery_0.webp',
      '/images/realisations/real_4_gallery_1.webp',
      '/images/realisations/real_4_gallery_2.webp',
      '/images/realisations/real_4_gallery_3.webp',
    ],
  }),
  buildProject({
    slug: 'sundara-retreat',
    title: 'Sundara Retreat',
    cover: '/images/realisations/real_5_cover.webp',
    coverType: 'video',
    gallery: [
      '/images/realisations/real_5_gallery_0.webp',
      '/images/realisations/real_5_gallery_1.webp',
      '/images/realisations/real_5_gallery_2.webp',
      '/images/realisations/real_5_gallery_3.webp',
    ],
    stats: [
      ['+24%', 'Additional income'],
      ['2025', 'Project year'],
      ['-60%', 'Web & Social traffic'],
    ],
  }),
  buildProject({
    slug: 'nerea-lodge',
    title: 'Nerea Lodge',
    cover: '/images/realisations/real_6_cover.webp',
    coverType: 'video',
    gallery: [
      '/images/realisations/real_6_gallery_0.webp',
      '/images/realisations/real_6_gallery_1.jpg',
      '/images/realisations/real_6_gallery_2.jpg',
      '/images/realisations/real_6_gallery_3.webp',
    ],
  }),
];
