# Content editing guide

This site keeps **text and images in simple JavaScript files** — no CMS login required. You edit a file, save it, and redeploy (or let your host rebuild automatically).

**Read this guide first.** For global settings (logo, email, menu), start with [`site.js`](./site.js). For page copy, use the files in [`pages/`](./pages/).

---

## Quick reference

| What you want to change | File to open |
|-------------------------|--------------|
| Company name, logo, SEO, menu, footer | [`site.js`](./site.js) |
| Contact email & phone (displayed on site) | [`site.js`](./site.js) → `contact` |
| Contact form button & project types | [`site.js`](./site.js) → `contactForm` |
| Contact form **inbox** (where submissions go) | `.env` → `CONTACT_TO_EMAIL` (set by your developer) |
| Homepage hero, offers, logos, map | [`pages/homepage.js`](./pages/homepage.js) |
| Agency page | [`pages/agency.js`](./pages/agency.js) |
| Portfolio / works | [`pages/realisations.js`](./pages/realisations.js) |
| Careers / jobs | [`pages/join.js`](./pages/join.js) |
| Contact page background & photos | [`pages/contact-page.js`](./pages/contact-page.js) |
| Legal mentions | [`pages/legal.js`](./pages/legal.js) |
| Marquee words, values block, slider button | [`pages/shared.js`](./pages/shared.js) |

**Do not edit** `pages/helpers.js` — it is internal plumbing.

---

## Before you edit

1. **Use a code editor** (VS Code, Cursor, etc.) — not Word or Google Docs.
2. **Keep quotes** around text: `'like this'` or `"like this"`.
3. **Keep commas** between list items. A missing comma often breaks the whole site build.
4. **Use straight quotes** in code (`'` and `"`), not curly “smart” quotes.
5. **Images & videos** go in the `public/` folder. Reference them with a path starting with `/`, e.g. `'/images/my-logo.png'`.

---

## Example 1 — Change the company name & email

**File:** `site.js`

**Before:**
```js
brand: {
  name: 'Aurora Agency',
  shortName: 'Aurora',
  // ...
},
contact: {
  email: 'contact@kre8.ch',
  phoneDisplay: '01 75 92 94 75',
  // ...
},
```

**After:**
```js
brand: {
  name: 'Marina Studio',
  shortName: 'Marina',
  // ...
},
contact: {
  email: 'hello@marina.studio',
  phoneDisplay: '+41 33 000 00 00',
  // ...
},
```

This updates the header label, footer, menu contact links, map block, and contact emails (when combined with `.env`).

---

## Example 2 — Swap the header logo

**File:** `site.js`

1. Put your logo in `public/images/`, e.g. `public/images/logo.svg`
2. Set:

```js
brand: {
  logoWordmark: '/images/logo.svg',  // was null
  logoIcon: '/images/logo-icon.png', // optional footer icon
  // ...
},
```

Leave as `null` to keep the built-in SVG symbol.

---

## Example 3 — Change the homepage hero headline

**File:** `pages/homepage.js`

**Before:**
```js
titleHero: 'Together we shape the success of your season',
```

**After:**
```js
titleHero: 'We grow luxury hospitality brands worldwide',
```

For a **line break** in a title, use `<br/>`:

```js
titleLogos: 'Trusted Worldwide, <br/>End-to-end',
```

---

## Example 4 — Update an offer card (homepage)

**File:** `pages/homepage.js` → find the `offerCards` array.

**Before:**
```js
{
  titre: 'Expand <br/> Your Reach',
  description: 'Position your property where travelers actually decide...',
  liste_de_tags: homeCardTags(['Paid Media', 'SEO', 'Partnerships']),
  video: {
    url: '/videos/82abac7f4ce5dfc470e9d26b11076edb29aede37.mp4',
    mediaType: 'video',
  },
},
```

**After:**
```js
{
  titre: 'Grow <br/> Your Audience',
  description: 'Your new description here.',
  liste_de_tags: homeCardTags(['Social Media', 'SEO', 'PR']),
  video: {
    url: '/videos/my-new-card-video.mp4',
    mediaType: 'video',
  },
},
```

Only change the **text and paths** — leave `_key`, `_type`, and `homeCardTags(...)` as they are.

---

## Example 5 — Change partner logos (one list, two marquees)

**File:** `pages/homepage.js` → `partnerLogoPaths`

**Before:**
```js
const partnerLogoPaths = [
  '/images/home_2.webp',
  '/images/home_3.webp',
  // ...
];
```

**After:** add or replace paths (both logo rows update automatically):

```js
const partnerLogoPaths = [
  '/images/clients/hotel-a.png',
  '/images/clients/hotel-b.png',
  '/images/clients/hotel-c.png',
];
```

Upload files to `public/images/clients/` first.

---

## Example 6 — Add a portfolio project

**File:** `pages/realisations.js`

1. Copy an existing `buildProject({ ... })` block.
2. Paste it **before** the closing `];`
3. Add a **comma** after the previous block.
4. Set a **unique** `slug` (lowercase, hyphens, no spaces).

**Example — new project:**

```js
  buildProject({
    slug: 'alpine-retreat',
    title: 'Alpine Retreat',
    cover: '/images/realisations/alpine-cover.webp',
    coverType: 'image',
    gallery: [
      '/images/realisations/alpine-1.webp',
      '/images/realisations/alpine-2.webp',
      '/images/realisations/alpine-3.webp',
      '/images/realisations/alpine-4.webp',
    ],
    stats: [
      ['+30%', 'Additional income'],
      ['2026', 'Project year'],
      ['+55%', 'Web & social traffic'],
    ],
  }),
```

The page will be live at **`/realisations/alpine-retreat`**.

---

## Example 7 — Add a job opening

**File:** `pages/join.js` → `jobs` array

**Before:** 3 jobs listed.

**After — add a fourth:**

```js
  {
    title_job: 'Marketing Manager',
    link_job: { url: 'https://careers.example.com/marketing' },
    link_tags: [
      { tag: 'Marketing' },
      { tag: 'Hybrid' },
      { tag: 'Full-time' },
    ],
  },
```

`link_job.url` is the link when someone clicks the job card (use a full `https://` URL for real applications).

---

## Example 8 — Edit legal page (plain language)

**File:** `pages/legal.js` → `sections` array

**Before:**
```js
{
  heading: 'Éditeur du site',
  body: "Le site aurora-agency.ovh est édité par Aurora Agency...",
},
```

**After:**
```js
{
  heading: 'Éditeur du site',
  body: "Le site example.com est édité par Marina Studio, agence de communication.",
},
```

Do **not** edit `legal_content` — it is generated from `sections` automatically.

---

## Example 9 — Marquee & values section text

**File:** `pages/shared.js`

**Before:**
```js
marqueeWords: ['Ethics', 'Humanism', 'Transparency', 'Performance'],
sliderCta: 'Découvrir',
```

**After:**
```js
marqueeWords: ['Integrity', 'Care', 'Clarity', 'Results'],
sliderCta: 'View project',
```

---

## Example 10 — Agency stats

**File:** `pages/agency.js`

**Before:**
```js
agence_stats: agenceStats([
  ['8', 'agencies across France'],
  ['84', 'customer renewal'],
  // ...
]),
```

**After:**
```js
agence_stats: agenceStats([
  ['12', 'studios across Europe'],
  ['90', 'client retention'],
  // ...
]),
```

Each line is `[number or text, label below the number]`.

---

## Common mistakes

| Mistake | What happens |
|---------|----------------|
| Missing comma between objects | Site fails to build |
| Smart quotes `"like this"` | Syntax error |
| Unclosed quote `'text` | Syntax error |
| Duplicate project `slug` | Wrong page or build conflict |
| Image path without leading `/` | Broken image |
| Editing `helpers.js` | Unexpected breakage — avoid |

---

## After saving

- **Local preview:** your developer runs `npm run dev`
- **Production:** push to Git / redeploy on Vercel (or your host) — the site rebuilds automatically

If the build fails, undo your last change or ask your developer — the error message usually points to the file and line number.

---

## Need help?

- **Global settings:** [`site.js`](./site.js) (comments at top of file)
- **Page content index:** [`content.js`](./content.js) (comments at top of file)
- **Colors & fonts:** `src/styles/tokens-marina.css` (developer territory)
