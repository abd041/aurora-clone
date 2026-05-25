/**
 * AGENCY PAGE (/agence) — hero, stats, values, split section.
 */

import { agenceStats, homeCardTags } from './helpers.js';

const offerCards = [
  {
    categorie: 'our offer',
    titre: 'Expand <br/> Your Reach',
    subtitle: null,
    description: `Position your property where travelers actually decide.
We amplify your presence with seasonal storytelling, premium placements, and partners that matter—so your brand shows up first in minds, maps, and feeds across key markets. Visibility
that compounds, beyond a single campaign.`,
    liste_de_tags: homeCardTags(['Paid Media', 'SEO', 'Partnerships']),
  },
  {
    categorie: 'our offer',
    titre: 'Elevate <br/> Your Brand',
    subtitle: null,
    description:
      'Craft a signature identity that guests instantly recognize and remember. From visuals to voice, every touchpoint speaks the same refined language—on site, online, and in print—so your property stands apart and commands premium perception.',
    liste_de_tags: homeCardTags(['Brand System', 'Art Direction', 'Content Studio']),
  },
  {
    categorie: 'our offer',
    titre: 'Maximize <br/> Your Bookings',
    subtitle: null,
    description:
      'Turn attention into reservations. We streamline the path from inspiration to purchase with persuasive offers, trust signals, and frictionless UX—then time everything to demand. The result: fuller calendars, healthier ADR, and steadier cashflow all season long.',
    liste_de_tags: homeCardTags(['CRO/UX', 'Offers & Pricing', 'Meta/Google Ads']),
  },
];

const values = [
  {
    titre: 'Engagement',
    name: 'Engagement',
    description:
      'At Aurora, we commit fully to every mandate—delivering refined, high-performing communication tailored to luxury outdoor hospitality. Precision, accountability, and on-time execution are the standards behind our results.',
    image: '/images/valeur-engagement.webp',
  },
  {
    titre: 'Independence',
    name: 'Independence',
    description:
      "We respect each client's unique identity, offering customized solutions tailored to your values and heritage, while ensuring a transparent and autonomous approach.",
    image: '/images/valeur-independance.webp',
  },
  {
    titre: 'Humanism',
    name: 'Humanism',
    description:
      'At Aurora Agency, people come first. We foster collective intelligence by valuing every collaborator and client, creating collaborative and creative projects where everyone contributes.',
    image: '/images/valeur-humanism.webp',
  },
  {
    titre: 'Performance',
    name: 'Performance',
    description:
      'We strive for excellence at every stage of our work. Through a culture of continuous improvement and transparent results, we help you achieve sustainable and measurable performance.',
    image: '/images/valeur-performance.webp',
  },
];

export const agence = {
  agence_hero_title:
    'Aurora Agency, the expert in communication for luxury outdoor hospitality',

  agence_description: `Aurora is a creative agency dedicated to luxury outdoor hospitality and glamping.

Born from the expertise of seasoned specialists with over 30 years in the field, we unite design craft, strategic vision, and immersive storytelling. 

Today, more than 300 premium properties across Europe trust our 35 collaborators to refine their identity, grow their visibility, and elevate every season with consistency and elegance.`,

  agence_stats: agenceStats([
    ['8', 'agencies across France'],
    ['84', 'customer renewal'],
    ['+350', 'accompanied clients'],
    ['+30', 'years of experience'],
    ['+40', 'employees throughout France'],
  ]),

  agence_cards_title: 'Why choose Aurora Agency?',
  agence_cards_desc: `Because we support you
through the three major phases of your clients' lives`,
  agence_cards: offerCards,

  agence_split_title: 'Partnership as Our Differentiated Growth Model',
  agence_split_desc:
    'At Aurora, our model is built on long-term performance and trust. We believe true growth comes from partnerships sustained over seasons, with measurable goals and transparent outcomes. By aligning success with results, not volume, we ensure each property benefits from continuous refinement, optimized strategies, and lasting profitability across the years.',
  agence_split_video: { image: '/images/agence_0.webp', mediaType: 'image' },

  agence_valeurs_title: 'People, Planet & Responsible Growth',
  agence_valeurs_desc:
    'As a trusted partner in luxury outdoor hospitality, we place our expertise and creativity at the service of your success—helping your property be seen, desired, and remembered worldwide.',
  agence_valeurs: values,
};
