# Content editing guide (for non-technical editors)

This website stores **words, images, and videos** in simple text files. You do **not** need a CMS login. You edit a file, save it, and your developer redeploys the site (or the host rebuilds automatically).

**You only need two places:**

| What | Where |
|------|--------|
| **Global** — company name, logos, menu, footer, contact, SEO | [`site.js`](./site.js) |
| **Pages** — homepage, agency, portfolio, jobs, legal, etc. | Files in [`pages/`](./pages/) |

**Read this guide top to bottom once**, then use the quick reference and examples when you edit.

---

## Table of contents

1. [How updates work (3 steps)](#how-updates-work-3-steps)
2. [Which page is which on the website](#which-page-is-which-on-the-website)
3. [Where to put images and videos](#where-to-put-images-and-videos)
4. [Logos — all locations](#logos--all-locations)
5. [Images — complete guide](#images--complete-guide)
6. [Videos — complete guide](#videos--complete-guide)
7. [Text rules (read before editing)](#text-rules-read-before-editing)
8. [File: `site.js` (global settings)](#file-sitejs-global-settings)
9. [File: `pages/homepage.js`](#file-pageshomepagejs)
10. [File: `pages/agency.js`](#file-pagesagencyjs)
11. [File: `pages/realisations.js` (portfolio)](#file-pagesrealisationsjs-portfolio)
12. [File: `pages/join.js` (careers)](#file-pagesjoinjs-careers)
13. [File: `pages/contact-page.js`](#file-pagescontact-pagejs)
14. [File: `pages/legal.js`](#file-pageslegaljs)
15. [File: `pages/shared.js`](#file-pagessharedjs)
16. [What you should not edit](#what-you-should-not-edit)
17. [Common mistakes](#common-mistakes)
18. [Checklist before publishing](#checklist-before-publish)
19. [After saving](#after-saving)

---

## How updates work (3 steps)

Every image, video, or text change follows the same pattern:

```text
1. Add or replace the file in the  public/  folder on your computer
2. Copy the path into the right  .js  file  (e.g. '/images/my-photo.webp')
3. Save the file → send to your developer or push to Git → site rebuilds
```

**Path rule:** always start with `/` and match the folder under `public/`.

| You put the file here | You write this in the data file |
|----------------------|----------------------------------|
| `public/images/logo.svg` | `'/images/logo.svg'` |
| `public/videos/hero.mp4` | `'/videos/hero.mp4'` |
| `public/images/clients/hotel-a.png` | `'/images/clients/hotel-a.png'` |

The website does **not** read files from your Desktop or Downloads folder directly — they must live inside the project’s `public/` folder.

---

## Which page is which on the website

| URL on the live site | What visitors see | File to edit |
|---------------------|-------------------|--------------|
| `/` (homepage) | Hero video, “Outdoor Agency” section, offer cards, partner logos, map, gallery, projects slider | [`pages/homepage.js`](./pages/homepage.js) + [`pages/realisations.js`](./pages/realisations.js) + [`pages/shared.js`](./pages/shared.js) |
| `/agence` | Agency story, stats, values cards, stacked offer cards | [`pages/agency.js`](./pages/agency.js) |
| `/realisations` | Full portfolio list | [`pages/realisations.js`](./pages/realisations.js) |
| `/realisations/your-project-name` | One project detail page | Same file — each project has a `slug` |
| `/contact` | Contact form + photo trail | [`pages/contact-page.js`](./pages/contact-page.js) + [`site.js`](./site.js) for form labels |
| `/nous-rejoindre` | Careers hero + job list | [`pages/join.js`](./pages/join.js) |
| `/mentions-legales` | Legal page | [`pages/legal.js`](./pages/legal.js) |
| **Every page** — header logo, menu, footer | [`site.js`](./site.js) |

---

## Where to put images and videos

Recommended folder layout inside **`public/`** (create folders if they do not exist):

```text
public/
├── images/                    ← general photos (hero, gallery, values…)
│   ├── home_0.webp            ← homepage ambassador photos
│   ├── home_2.webp … home_8.webp   ← partner logos
│   ├── home_9.webp            ← gallery hero image
│   ├── home_10.webp …         ← gallery grid
│   ├── valeur-engagement.webp ← agency “values” cards
│   ├── agence_0.webp          ← agency page image
│   ├── join-us.avif           ← careers hero background
│   ├── realisations/          ← portfolio covers + gallery
│   │   ├── real_0_cover.webp
│   │   └── real_0_gallery_0.webp
│   ├── clients/               ← optional: your own subfolder for logos
│   └── trail/                 ← contact page scrolling photos
├── videos/                    ← all .mp4 (or similar) videos
│   ├── 95382adb….mp4          ← homepage opening hero
│   ├── 794268a9….mp4          ← “Outdoor Agency” section video
│   └── …                      ← offer card videos, ambassador videos
├── og.jpg                     ← link preview image (social sharing)
├── favicon.svg                ← browser tab icon (small)
└── _nuxt/                     ← some legacy assets (intro, menu bg, map SVG)
```

**Formats that work well**

| Type | Recommended formats |
|------|---------------------|
| Photos | `.webp`, `.jpg`, `.png`, `.avif` |
| Logos on cards | `.webp` or `.png` with transparent background |
| Videos | `.mp4` (H.264), keep file size reasonable for web |

**Tip:** Use the **same file names** when replacing an image (e.g. swap `home_2.webp` with a new file still named `home_2.webp`) so you only replace the file and do not have to edit code.

---

## Logos — all locations

| Where it appears | Setting in `site.js` | How to change |
|------------------|----------------------|---------------|
| **Header** (top left wordmark) | `brand.logoWordmark` | Set to `'/images/your-logo.svg'` or leave `null` for built-in symbol |
| **Footer** (small icon, center) | `brand.logoIcon` | Set to `'/images/your-icon.png'` or leave `null` for built-in “8” symbol |
| **Intro splash** (first visit animation) | `brand.logoIntro` | Path to a PNG, e.g. `'/images/logo-intro.png'` |
| **Browser tab icon** | Not in `site.js` — file at `public/favicon.svg` | Replace `public/favicon.svg` (ask developer if unsure) |
| **Social share image** | `seo.ogImage` | Usually `'/og.jpg'` — replace `public/og.jpg` |

**Example — custom header + footer logo**

1. Add `public/images/my-logo.svg` and `public/images/my-icon.png`
2. In `site.js`:

```js
brand: {
  name: 'Your Company Name',
  shortName: 'Your Co',
  logoWordmark: '/images/my-logo.svg',
  logoIcon: '/images/my-icon.png',
  logoIntro: '/images/logo-intro.png',
},
```

Use `null` for any logo you want to keep as the default built-in design.

---

## Images — complete guide

Below is **every image group** you can change, with the exact file and field name.

### Homepage (`pages/homepage.js`)

| What you see | Field / list name | Typical path pattern |
|--------------|-------------------|----------------------|
| Opening full-screen video | *(video — see Videos section)* | `videoHeroHome.url` |
| Ambassador portrait (small) | Inside `ambassadors` → `avatarAmbassadeur.url` | `/images/home_0.webp`, `home_1.webp` |
| Partner logo marquee (both rows) | `partnerLogoPaths` array at top of file | `/images/home_2.webp` … `home_8.webp` |
| Gallery grid photos | `galleryPaths` array | `/images/home_10.webp` … |
| Large gallery anchor image | `mainImageGallery` | `/images/home_9.webp` |

**Add a partner logo:** add a line to `partnerLogoPaths`:

```js
const partnerLogoPaths = [
  '/images/home_2.webp',
  '/images/my-new-client-logo.png',  // ← new line
];
```

**Add or remove an ambassador:** copy a whole `{ ... }` block in `ambassadors`, change name, email, phone, and image paths.

### Agency page (`pages/agency.js`)

| What you see | Field |
|--------------|-------|
| Values cards (Engagement, Independence…) | `values` array → `image: '/images/valeur-….webp'` |
| Split section photo | `agence_split_video` → `{ image: '/images/agence_0.webp', mediaType: 'image' }` |

### Portfolio (`pages/realisations.js`)

| What you see | Field in `buildProject({ ... })` |
|--------------|----------------------------------|
| Project cover (listing + hero) | `cover: '/images/realisations/….webp'` |
| Gallery images | `gallery: [ '/images/realisations/….webp', ... ]` |

### Careers (`pages/join.js`)

| What you see | Field |
|--------------|-------|
| Hero background | Set in page component — path is often `/images/join-us.avif` in code; ask developer if you change filename |

### Contact (`pages/contact-page.js`)

| What you see | Field |
|--------------|-------|
| Large background behind form | `contact_background` |
| Scrolling strip of photos | `trailImages` array at top of file |

### Global (`site.js`)

| What you see | Field |
|--------------|-------|
| Intro animation image | `brand.logoIntro` |
| Mobile menu background | `assets.introBgMobile`, `assets.menuBgMobile` |

---

## Videos — complete guide

| Page / section | Field in data file | Notes |
|----------------|-------------------|--------|
| Homepage — first hero | `homepage.js` → `videoHeroHome.url` | Full-screen background |
| Homepage — “Outdoor Agency” block | `homepage.js` → `videoPlayer.url` | Video behind scrolling titles |
| Homepage — offer cards (×3) | Each card in `offerCards` → `video.url` | One video per card |
| Homepage — map ambassadors | `ambassadors` → `bgVideoAmbassadeur.url` | Background when that person is selected |
| Agency page — hero + 3 offer cards | `src/app/agence/page.js` → `AGENCE_VIDEOS` | See [Agency videos (special case)](#agency-videos-special-case) below |
| Legal page background video | `src/app/mentions-legales/page.js` | `/videos/test-contact.mp4` — developer file |
| Join page hero background | `src/app/nous-rejoindre/page.js` | Replace `public/images/join-us.avif` **or** ask developer to change path |

**Replace a homepage offer card video:**

```js
video: {
  url: '/videos/my-new-video.mp4',
  mediaType: 'video',
},
```

Put `my-new-video.mp4` in `public/videos/`.

**Important:** Keep `mediaType: 'video'` when it is a video. For photos use `mediaType: 'image'`.

### Agency videos (special case)

On the **Agency** page (`/agence`), hero and card videos are **not** in `agency.js`. They are listed at the top of:

`src/app/agence/page.js`

```js
const AGENCE_VIDEOS = {
  hero: '/videos/789f4e98….mp4',
  card0: '/videos/82abac7f….mp4',
  card1: '/videos/7db34db6….mp4',
  card2: '/videos/54ddd736….mp4',
};
```

**Easiest approach:** upload new `.mp4` files to `public/videos/` and ask your developer to update these four paths.  
**Or:** replace the existing video files in `public/videos/` **keeping the exact same filenames** — then no code change is needed.

### Join page hero image (special case)

The careers hero uses `public/images/join-us.avif`. To change the photo **without code**:

1. Export your new photo as `join-us.avif` (or ask developer to accept `.webp`).
2. Replace the file at `public/images/join-us.avif`.

To use a **different filename**, your developer must edit `src/app/nous-rejoindre/page.js` (line with `background="/images/join-us.avif"`).

---

## Text rules (read before editing)

1. **Use a code editor** (VS Code, Cursor, Notepad++ with care) — not Word or Google Docs for the data files.
2. **Quotes around text:** `'Single quotes'` or `"double quotes"` — be consistent within one file.
3. **Commas between items** in lists `{ ... }, { ... }` — a missing comma breaks the build.
4. **Straight quotes only** — not curly “smart” quotes from Word.
5. **Line breaks in titles:** use `<br/>` (not Enter in the middle of a string without meaning).

```js
// Good — line break in a headline
titleLogos: 'Trusted Worldwide, <br/>End-to-end',

// Good — long text can use Enter inside backticks `...` or quotes
description: `Line one.
Line two still same paragraph.`,
```

6. **Leave technical lines alone** — lines with `_key`, `_type`, `homeCardTags(`, `buildProject(`, `logoItems(` — change only the **human-readable** parts inside.

---

## File: `site.js` (global settings)

Open: [`src/data/site.js`](./site.js)

### `brand` — name and logos

| Field | What it controls |
|-------|------------------|
| `name` | Full company name (header accessibility, emails) |
| `shortName` | Short name in browser tab / app title |
| `logoWordmark` | Header logo image path, or `null` |
| `logoIcon` | Footer icon path, or `null` |
| `logoIntro` | Splash screen logo — default may be `/_nuxt/…`; use `/images/your-intro.png` after upload |

### `seo` — Google & social

| Field | What it controls |
|-------|------------------|
| `defaultTitle` | Default page title |
| `titleSuffix` | Appears after page names, e.g. `Contact - Aurora` |
| `defaultDescription` | Short description for search engines |
| `ogImage` | Image when link is shared (path to `public/og.jpg`) |

### `contact` — phone, email, map block

| Field | What it controls |
|-------|------------------|
| `email` | Email shown on site and in mailto links |
| `phone` | Raw number for `tel:` links (digits, with country code) |
| `phoneDisplay` | How the phone number is displayed |
| `mapPhone` / `mapPhoneDisplay` | Switzerland office on map (Contact + Agency) |
| `mapHeading` | Title above map, e.g. `Aurora Agency Switzerland` |

### `contactForm` — contact page form

| Field | What it controls |
|-------|------------------|
| `pageTitle` | Big “Contact” heading on form |
| `submitLabel` | Submit button text |
| `submittingLabel` | Text while sending |
| `requiredNote` | Small note under button |
| `projectTypes` | Pills: Website, Branding, etc. — edit `label` to rename |

To **add a project type pill**, copy an existing `{ id, value, label }` block and use a **new unique** `id` and `value` (e.g. `events` / `events` / `Events`).

### `menu` — navigation

| Field | What it controls |
|-------|------------------|
| `description` | Optional paragraph in menu — use `''` to hide |
| `links` | Menu items: `titre` = label, `to` = URL path |
| `contactLinks` | Phone and email at bottom of menu |

**Rename a menu item:**

```js
{ titre: 'Our Agency', to: '/agence' },
```

**Change menu order:** reorder the `{ titre, to }` lines (keep commas).

### `footer`

| Field | What it controls |
|-------|------------------|
| `description` | Large quote on cream section — HTML allowed: `<br />` for line breaks |
| `credits` | Design / development links — set whole `credits` to `null` to hide |

### `assets`

| Field | What it controls |
|-------|------------------|
| `introBgMobile` | Mobile intro background image |
| `menuBgMobile` | Mobile full-screen menu background |

---

## File: `pages/homepage.js`

Open: [`src/data/pages/homepage.js`](./pages/homepage.js)

### Section map (top → bottom on homepage)

| Order | What visitors see | What to edit |
|-------|-------------------|--------------|
| 1 | Full-screen hero video | `videoHeroHome` |
| 2 | “Together we shape…” + Outdoor / Agency | `titleHero`, `firstTitlePlayer`, `secondTitlePlayer`, `descriptionPlayer`, `videoPlayer` |
| 3 | Stacked offer cards | `titleCards`, `offers`, `offerCards` |
| 4 | Partner logos (brown section) | `titleLogos`, `descLogos`, `partnerLogoPaths` |
| 5 | Map + ambassadors | `titleAmbassadeurs`, descriptions, `liste_des_etapes`, `ambassadors` |
| 6 | Photo gallery | `mainImageGallery`, `galleryPaths` |
| 7 | Project slider | Projects come from `realisations.js` |
| 8 | Values + marquees | `shared.js` |

### `offerCards` — each card

| Field | Meaning |
|-------|---------|
| `titre` | Card headline — `<br/>` allowed |
| `description` | Body text |
| `liste_de_tags` | Tags — only change text inside `homeCardTags([ 'Tag1', 'Tag2' ])` |
| `video.url` | Card background video path |

### `ambassadors` — each person on the map

| Field | Meaning |
|-------|---------|
| `nomAmbassadeur` | First name shown |
| `nameRegionAmbassadeur` | Region label after name |
| `mailAmbassadeur` | Email (display only; not necessarily real inbox) |
| `telephoneAmbassadeur` | Phone shown |
| `avatarAmbassadeur.url` | Small portrait image |
| `bgVideoAmbassadeur.url` | Background video when selected |

### `liste_des_etapes` — numbered steps (right column on desktop)

Edit the list inside `mapSteps([ 'Step 1', 'Step 2', ... ])`.

---

## File: `pages/agency.js`

Open: [`src/data/pages/agency.js`](./pages/agency.js)

| Field | What it controls |
|-------|------------------|
| `agence_hero_title` | Hero headline |
| `agence_description` | Long intro paragraph |
| `agence_stats` | Numbers — `agenceStats([ ['8', 'label'], ... ])` |
| `agence_cards_title` | Title above stacked cards |
| `agence_cards_desc` | Text under that title |
| `agence_cards` | Three offer cards (text only on agency — videos set in app code) |
| `agence_split_title` / `agence_split_desc` | Split section |
| `agence_split_video` | Image: `{ image: '/images/agence_0.webp', mediaType: 'image' }` |
| `agence_valeurs_title` / `agence_valeurs_desc` | Values section titles |
| `agence_valeurs` | Cards: `titre`, `description`, `image` per value |

**Change a stat:**

```js
agence_stats: agenceStats([
  ['12', 'studios in Europe'],
  ['90', 'client retention'],
]),
```

---

## File: `pages/realisations.js` (portfolio)

Open: [`src/data/pages/realisations.js`](./pages/realisations.js)

### Add a new project (step by step)

1. Copy an entire `buildProject({ ... })` block.
2. Paste it before the closing `];` of the list.
3. Add a comma after the previous project’s `}),`.
4. Set a **unique** `slug` (lowercase, hyphens only): `my-hotel-name`.
5. Add images under `public/images/realisations/`.
6. Update `cover` and `gallery` paths.

```js
buildProject({
  slug: 'alpine-retreat',           // URL: /realisations/alpine-retreat
  title: 'Alpine Retreat',          // Project name shown on site
  cover: '/images/realisations/alpine-cover.webp',
  coverType: 'image',               // or 'video' for video cover
  gallery: [
    '/images/realisations/alpine-1.webp',
    '/images/realisations/alpine-2.webp',
  ],
  stats: [
    ['+30%', 'Additional income'],
    ['2026', 'Project year'],
    ['+55%', 'Web & social traffic'],
  ],
}),
```

### Remove a project

Delete its entire `buildProject({ ... }),` block including the comma — or ask your developer to avoid mistakes.

---

## File: `pages/join.js` (careers)

Open: [`src/data/pages/join.js`](./pages/join.js)

| Field | What it controls |
|-------|------------------|
| `hero_td_titre` | Big title, e.g. `Join us` |
| `hero_td_desc` | Paragraph under title |
| `marquee_word` | Scrolling text, e.g. `Job openings` |
| `jobs` | List of job cards |

**Each job:**

| Field | Meaning |
|-------|---------|
| `title_job` | Job title |
| `link_job.url` | Link when card is clicked — use full `https://...` for real jobs |
| `link_tags` | Pills — array of `{ tag: 'Remote' }` |

---

## File: `pages/contact-page.js`

Open: [`src/data/pages/contact-page.js`](./pages/contact-page.js)

| Field | What it controls |
|-------|------------------|
| `contact_background` | Large image behind the form |
| `trailImages` | List of images in the animated trail — edit paths at top of file |

Form wording is in **`site.js`** → `contactForm`.

**Where contact emails go:** not in these files — your developer sets `CONTACT_TO_EMAIL` in `.env` (inbox for form submissions).

---

## File: `pages/legal.js`

Open: [`src/data/pages/legal.js`](./pages/legal.js)

| Field | What it controls |
|-------|------------------|
| `legal_title` | Page title, e.g. `Mentions légales` |
| `sections` | Array of `{ heading, body }` — **edit only this** |

Do **not** edit `legal_content` — it is built automatically from `sections`.

You may use simple HTML in `body`, e.g. `<a href="/contact">contact form</a>`.

---

## File: `pages/shared.js`

Open: [`src/data/pages/shared.js`](./pages/shared.js)

| Field | What it controls |
|-------|------------------|
| `valeursTitle` | Homepage “Our Values & ESG Commitments” title |
| `valeursDesc` | Line under that title |
| `marqueeWords` | Words scrolling in marquees (several pages) |
| `sliderCta` | Homepage project slider button, e.g. `Découvrir` |

```js
marqueeWords: ['Ethics', 'Humanism', 'Transparency', 'Performance'],
```

---

## What you should not edit

| File / area | Reason |
|-------------|--------|
| `pages/helpers.js` | Internal formatting — breaks site if changed wrongly |
| `src/data/content.js` | Only an index — edit `site.js` and `pages/*.js` instead |
| `src/styles/*.css` | Colors and layout — developer |
| `src/app/agence/page.js` | Agency hero + card videos only — unless you replace files with same names |
| `src/app/nous-rejoindre/page.js` | Join hero image path — unless you keep `join-us.avif` |
| `src/app/mentions-legales/page.js` | Legal page background video |
| `src/components/**` | React code — developer |
| `.env` | Secrets and email inbox — developer |
| Lines with only `_key`, `_type` | Technical IDs — leave as-is |

---

## Common mistakes

| Mistake | What happens |
|---------|----------------|
| Missing comma between `}` blocks | Site fails to build |
| Smart quotes `“text”` | Error |
| Forgotten closing quote `'text` | Error |
| Two projects with same `slug` | Wrong URL or broken build |
| Image path without leading `/` | Broken image |
| Wrong file location (not in `public/`) | Broken image or video |
| Edited `legal_content` instead of `sections` | Changes do not appear |
| Removed `mediaType: 'video'` on a video | Card or hero may break |

If the build fails, **undo your last save** or send the error message to your developer — it usually names the file and line number.

---

## Checklist before publishing

Use this every time you send an update:

- [ ] New images/videos are inside `public/` (correct subfolder)
- [ ] Paths in `.js` files match filenames exactly (case-sensitive on some servers)
- [ ] Every `slug` for projects is unique
- [ ] Commas between all list items
- [ ] No smart quotes in edited files
- [ ] Menu and contact email/phone updated in `site.js` if they changed
- [ ] You did not edit `helpers.js` or CSS files
- [ ] Legal changes were made in `sections` only
- [ ] Developer has run build or deploy after your push

---

## After saving

| Step | Who |
|------|-----|
| Preview on your computer | Developer runs `npm run dev` |
| Live website | Push to Git, or send files to developer → deploy (e.g. Vercel) rebuilds |

Typical turnaround: you edit → save → push → site updates in a few minutes after build succeeds.

---

## Quick reference (one table)

| What you want to change | File to open |
|-------------------------|--------------|
| Company name, logos, SEO, menu, footer | [`site.js`](./site.js) |
| Contact email & phone (shown on site) | [`site.js`](./site.js) → `contact` |
| Contact form labels & project pills | [`site.js`](./site.js) → `contactForm` |
| Contact form **inbox** | `.env` → `CONTACT_TO_EMAIL` (developer) |
| Homepage — all sections | [`pages/homepage.js`](./pages/homepage.js) |
| Agency page | [`pages/agency.js`](./pages/agency.js) |
| Portfolio / works | [`pages/realisations.js`](./pages/realisations.js) |
| Careers / jobs | [`pages/join.js`](./pages/join.js) |
| Contact page images | [`pages/contact-page.js`](./pages/contact-page.js) |
| Legal mentions | [`pages/legal.js`](./pages/legal.js) |
| Marquee, values title, slider button | [`pages/shared.js`](./pages/shared.js) |

---

## Step-by-step examples

### Example 1 — Change the company name everywhere

1. Open [`site.js`](./site.js).
2. Change `brand.name` and `brand.shortName`.
3. Save. Header, SEO, and accessibility labels update on deploy.

### Example 2 — Replace the header logo

1. Save your logo as `public/images/header-logo.svg` (SVG or PNG).
2. In `site.js`, set `logoWordmark: '/images/header-logo.svg'`.
3. Save and deploy.

### Example 3 — Add one partner logo on the homepage

1. Add `public/images/client-hotel-x.webp`.
2. Open [`pages/homepage.js`](./pages/homepage.js).
3. In `partnerLogoPaths`, add a new line: `'/images/client-hotel-x.webp',`
4. Save. Both logo marquees show the new logo.

### Example 4 — Change homepage hero video

1. Add `public/videos/new-hero.mp4` (compress for web if possible).
2. In `homepage.js`, find `videoHeroHome` and change `url` to `'/videos/new-hero.mp4'`.
3. Save and deploy.

### Example 5 — Edit one offer card (title + text + video)

1. Open `homepage.js` → find the right block in `offerCards`.
2. Change `titre`, `description`, and `video.url`.
3. Do not delete `_key`, `_type`, or `liste_de_tags` structure — only change words inside `homeCardTags([ ... ])`.

### Example 6 — Update an ambassador on the map

1. Add portrait `public/images/julie-new.webp` and optional video in `public/videos/`.
2. In `ambassadors`, find Julie’s `{ ... }` block.
3. Update `nomAmbassadeur`, phones, emails, `avatarAmbassadeur.url`, `bgVideoAmbassadeur.url`.
4. Save.

### Example 7 — Add a portfolio project

1. Create images in `public/images/realisations/` (cover + gallery).
2. Copy a `buildProject({ ... }),` block in [`realisations.js`](./pages/realisations.js).
3. Set new `slug`, `title`, `cover`, `gallery`, `stats`.
4. Save. New URL: `https://yoursite.com/realisations/your-slug`

### Example 8 — Change contact form button text

1. Open `site.js` → `contactForm`.
2. Change `submitLabel`, e.g. `'Send my request'`.
3. Save.

### Example 9 — Hide the menu disclaimer paragraph

1. Open `site.js` → `menu`.
2. Set `description: ''` (empty quotes).
3. Save.

### Example 10 — Update legal page in French

1. Open [`legal.js`](./pages/legal.js).
2. Edit `heading` and `body` inside `sections` only.
3. Save. Do not touch `legal_content`.

---

## Glossary (plain language)

| Word | Meaning |
|------|---------|
| **slug** | Short URL name for a project, e.g. `kruger-nyota-resort` → `/realisations/kruger-nyota-resort` |
| **path** | Address of a file on the site, always starting with `/`, e.g. `/images/photo.webp` |
| **`null`** | Means “use default / hide optional block” — type exactly `null` with no quotes |
| **`<br/>`** | Line break inside a title on the website |
| **`public/`** | Folder where all images and videos must live |
| **deploy** | Publishing your saved files so visitors see changes on the live site |

---

## Need help?

- **Global settings:** [`site.js`](./site.js) (comments at top of file)
- **Content file index:** [`content.js`](./content.js) (short pointer to this guide)
- **Colors & fonts:** `src/styles/tokens-marina.css` — ask your developer
- **This guide:** `src/data/CONTENT-GUIDE.md` (you are here)

If something on the site does not match this guide, ask your developer — the project may have been updated and the guide can be adjusted to match.
