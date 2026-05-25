/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CLIENT PAGE CONTENT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Global brand, logos, menu, footer & contact → src/data/site.js
 *
 *  Page copy is split into readable files under src/data/pages/:
 *    homepage.js      → / (hero, offers, logos, map, gallery)
 *    agency.js        → /agence
 *    realisations.js  → /realisations (portfolio projects)
 *    join.js          → /nous-rejoindre (careers)
 *    contact-page.js  → /contact (background & photo trail)
 *    legal.js         → /mentions-legales
 *    shared.js        → marquee words, values section, slider button
 *
 *  Tips:
 *    • Full editing guide → src/data/CONTENT-GUIDE.md
 *    • Use <br/> inside titles for line breaks
 *    • Put new images/videos in /public/ then reference e.g. '/images/my-photo.webp'
 *    • After editing, save the file — the site rebuilds on deploy
 *    • Do not remove commas between items in lists
 */

export { menuItems, menuDescription, menuContact } from '@/data/site';

export {
  homepageData,
  realisations,
  agence,
  accompagnement,
  contact,
  join,
  legal,
  sharedUi,
} from './pages/index.js';
