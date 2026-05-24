import { realisations } from '@/data/content';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurora-agency.ovh';

export default function sitemap() {
  const staticRoutes = [
    '',
    '/agence',
    '/contact',
    '/realisations',
    '/nous-rejoindre',
    '/mentions-legales',
  ];

  const staticEntries = staticRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  const projectEntries = realisations.map((item) => ({
    url: `${BASE_URL}/realisations/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries];
}
