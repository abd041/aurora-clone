/**
 * HOMEPAGE (/) — edit text & media paths below.
 * Use <br/> inside titles for line breaks. Images/videos go in /public/.
 */

import { galleryImages, homeCardTags, logoItems, mapSteps } from './helpers.js';

// ─── Partner logos (both marquee rows use the same list) ─────────────────────
const partnerLogoPaths = [
  '/images/home_2.webp',
  '/images/home_3.webp',
  '/images/home_4.webp',
  '/images/home_5.webp',
  '/images/home_6.webp',
  '/images/home_7.webp',
  '/images/home_8.webp',
];
const partnerLogos = logoItems(partnerLogoPaths);

// ─── Offer cards (stacked cards section) ────────────────────────────────────
const offerCards = [
  {
    _key: 'card-expand',
    _type: 'homeCard',
    categorie: 'Tailored offer',
    titre: 'Expand <br/> Your Reach',
    description: `Position your property where travelers actually decide.
We amplify your presence with seasonal storytelling, premium placements, and partners that matter—so your brand shows up first in minds, maps, and feeds across key markets. Visibility
that compounds, beyond a single campaign.`,
    liste_de_tags: homeCardTags(['Paid Media', 'SEO', 'Partnerships']),
    video: {
      url: '/videos/82abac7f4ce5dfc470e9d26b11076edb29aede37.mp4',
      mediaType: 'video',
    },
  },
  {
    _key: 'card-maximize',
    _type: 'homeCard',
    categorie: 'Tailored Offer',
    titre: 'Maximize <br/> Your Brand',
    description:
      'Turn attention into reservations. We streamline the path from inspiration to purchase with persuasive offers, trust signals, and frictionless UX—then time everything to demand. The result: fuller calendars, healthier ADR, and steadier cashflow all season long.',
    liste_de_tags: homeCardTags(['Offers & Pricing', 'CRO/UX', 'Meta/Google Ads']),
    video: {
      url: '/videos/70118bbbff3f93dc4870e1d8620b411f897711e2.mp4',
      mediaType: 'video',
    },
  },
  {
    _key: 'card-elevate',
    _type: 'homeCard',
    categorie: 'Tailored Offer',
    titre: 'Elevate <br/> Your Brand',
    description:
      'Craft a signature identity that guests instantly recognize and remember. From visuals to voice, every touchpoint speaks the same refined language—on site, online, and in print—so your property stands apart and commands premium perception.',
    liste_de_tags: homeCardTags(['Brand System', 'Art Direction', 'Content Studio']),
    video: {
      url: '/videos/54ddd736eb805dd0cc687c36e16ffed2a96a413d.mp4',
      mediaType: 'video',
    },
  },
];

// ─── Field ambassadors (Switzerland map section) ────────────────────────────
const ambassadors = [
  {
    nomAmbassadeur: 'Julie',
    nameRegionAmbassadeur: 'Interlaken',
    regionAmbassadeur: 'interlaken',
    mailAmbassadeur: 'michel@for.you',
    telephoneAmbassadeur: '+41 33 821 00 75',
    avatarAmbassadeur: { url: '/images/home_0.webp', mediaType: 'image' },
    bgVideoAmbassadeur: {
      url: '/videos/6b41749645d966da9e26fd7de220fbbf92d9d00e.mp4',
      mediaType: 'video',
    },
  },
  {
    nomAmbassadeur: 'Thomas',
    nameRegionAmbassadeur: 'Zürich',
    regionAmbassadeur: 'interlaken',
    mailAmbassadeur: 'thomas@voyage.fr',
    telephoneAmbassadeur: '+41 44 000 92 75',
    avatarAmbassadeur: { url: '/images/home_1.webp', mediaType: 'image' },
    bgVideoAmbassadeur: {
      url: '/videos/50f5e18ded2faa904046cac7e28c7af2cf2ed4d2.mp4',
      mediaType: 'video',
    },
  },
];

// ─── Photo gallery ──────────────────────────────────────────────────────────
const galleryPaths = [
  '/images/home_10.webp',
  '/images/home_11.webp',
  '/images/home_12.webp',
  '/images/home_13.webp',
  '/images/home_14.webp',
  '/images/home_15.webp',
  '/images/home_16.webp',
  '/images/home_10.webp',
];

export const homepageData = {
  // Hero background video
  videoHeroHome: {
    mediaType: 'video',
    url: '/videos/95382adb8d674929153e2bf1b15d8793e2e2a275.mp4',
  },

  // “Together we shape…” video section
  titleHero: 'Together we shape the success of your season',
  firstTitlePlayer: 'Outdoor',
  secondTitlePlayer: 'Agency',
  descriptionPlayer:
    'For more than three decades, Aurora Agency has partnered with luxury hotels and upscale campsites to craft communication that inspires. With 40+ creative experts and over 300 projects completed, our agency delivers design, digital strategy, film, print, and consulting that blend elegance with innovation.',
  videoPlayer: {
    mediaType: 'video',
    url: '/videos/794268a92b521d929c86cc3157aaa02dfd1f49ba.mp4',
  },

  // Offer cards section
  titleCards: 'Marketing crafted to suit every host',
  offers: ['Expand', 'Maximize', 'Elevate'],
  cardsHome: offerCards,

  // Partner logos section
  titleLogos: 'Trusted Worldwide, <br/>End-to-end',
  descLogos: null,
  firstLogos: partnerLogos,
  secondLogos: partnerLogos,

  // Map / ambassadors section
  titleAmbassadeurs: 'An Embedded Partner from Day One',
  first_description: `We believe you can't promote a place without living it.
Your ambassador visits regularly, meets your teams, listens to guests, and captures key moments—new spaces, seasonal rituals, meaningful details that define your experience.`,
  second_description:
    "At Aurora, you don't navigate alone. Your field ambassador is the bridge to our entire studio—curating experts, syncing calendars, and reporting progress with clarity.",
  liste_des_etapes: mapSteps([
    'Weekly On-Site Check-Ins',
    'Personalized Action Playbook',
    'Live Content Capture',
    'Editorial Calendar Orchestration',
  ]),
  ctaAmbassadeurs: 'Discover our offers',
  ambassadeurs: ambassadors,

  // Gallery
  mainImageGallery: '/images/home_9.webp',
  home_gallery: galleryImages(galleryPaths),
};
