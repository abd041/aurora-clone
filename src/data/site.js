/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CLIENT SITE SETTINGS — edit this file to update global text, logos & contact
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  • Full editing guide                             → src/data/CONTENT-GUIDE.md
 *  • Page copy (homepage, agency, projects, jobs…) → src/data/pages/
 *  • Contact form inbox (production)               → .env → CONTACT_TO_EMAIL
 *  • Brand colors & fonts                          → src/styles/tokens-marina.css
 *
 *  Logo files: place images in /public/images/ and set the paths below.
 *  Leave logoWordmark / logoIntro as null to keep the built-in SVG / animation.
 */

export const site = {
  /** Company / site name (header, emails, SEO, accessibility labels) */
  brand: {
    name: 'Aurora Agency',
    shortName: 'Aurora',
    /** Full wordmark in header — null = built-in SVG, or e.g. '/images/logo.svg' */
    logoWordmark: null,
    /** Small square icon in footer — null = built-in symbol, or path to PNG/SVG */
    logoIcon: null,
    /** Intro splash animation image */
    logoIntro: '/_nuxt/logo-intro.FMLjELMt.png',
  },

  /** Default SEO (individual pages can override in src/app/.../page.js) */
  seo: {
    defaultTitle: 'Aurora Agency',
    titleSuffix: 'Aurora',
    defaultDescription:
      'Where luxury outdoor meets glamping excellence, integrated marketing and communication, across the world.',
    ogImage: '/og.jpg',
  },

  /** Phone, email, map block on Contact / Agency pages */
  contact: {
    email: 'contact@kre8.ch',
    phone: '+33101010101',
    phoneDisplay: '01 75 92 94 75',
    /** Switzerland office — shown on the map block */
    mapPhone: '+41338210075',
    mapPhoneDisplay: '+41 33 821 00 75',
    mapHeading: 'Aurora Agency Switzerland',
  },

  /** Contact form — labels, pills & messages */
  contactForm: {
    pageTitle: 'Contact',
    requiredNote: '*All fields are required',
    submitLabel: 'Request an appointment',
    submittingLabel: 'Sending…',
    projectTypes: [
      { id: 'website', value: 'website', label: 'Website' },
      { id: 'branding', value: 'branding', label: 'Branding' },
      { id: 'photo_video', value: 'photo_video', label: 'Photo & Video' },
      { id: 'brochure', value: 'brochure', label: 'Brochure' },
      { id: 'autre', value: 'autre', label: 'Other' },
    ],
  },

  /** Full-screen navigation menu */
  menu: {
    description:
      "This project was originally a real project for an agency. Unfortunately, the visual and written content didn't meet the studio's standards, so we decided to release the website under a different name in order to showcase the project.",
    links: [
      { titre: 'Agency', to: '/agence' },
      { titre: 'Works', to: '/realisations' },
      { titre: 'Contact', to: '/contact' },
      { titre: 'Join us', to: '/nous-rejoindre' },
    ],
    /** Shown in menu footer — tel: and mailto: links */
    contactLinks: [
      { href: 'tel:+33101010101', label: '01 75 92 94 75' },
      { href: 'mailto:contact@kre8.ch', label: 'contact@kre8.ch' },
    ],
  },

  /** Footer tagline + optional credits (set credits to null to hide) */
  footer: {
    description:
      'Where luxury outdoor meets glamping <br /> excellence, integrated marketing <br /> and communication, across the world.',
    credits: {
      design: {
        label: 'Flot Noir Studio',
        href: 'https://www.linkedin.com/in/clementmerouani',
      },
      development: {
        label: 'Guillaume Colombel',
        href: 'https://guillaumecolombel.fr',
      },
    },
  },

  /** Loading intro & mobile menu background assets */
  assets: {
    introBgMobile: '/_nuxt/intro-bg-mobile.goTljaNO.png',
    menuBgMobile: '/_nuxt/intro-bg-mobile.goTljaNO.png',
  },
};

/** Build menu contact links from site.contact when contactLinks use defaults */
function buildMenuContactLinks() {
  return site.menu.contactLinks.map((link) => {
    if (link.href.startsWith('mailto:')) {
      return { href: `mailto:${site.contact.email}`, label: site.contact.email };
    }
    if (link.href.startsWith('tel:')) {
      return { href: `tel:${site.contact.phone}`, label: site.contact.phoneDisplay };
    }
    return link;
  });
}

export const menuItems = site.menu.links;
export const menuDescription = site.menu.description;
export const menuContact = buildMenuContactLinks();
