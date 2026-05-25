/** Internal helpers — builds the shape React components expect. Clients edit the data files, not this one. */

export function logoItems(paths) {
  return paths.map((logo, index) => ({
    _key: `logo-${index}`,
    _type: 'logoItem',
    logo,
    logoUrl: logo,
  }));
}

export function homeCardTags(tags) {
  return tags.map((tag, index) => ({
    _key: `tag-${index}`,
    _type: 'homeCardTag',
    tag,
  }));
}

export function mapSteps(titles) {
  return titles.map((etape_titre, index) => ({
    _key: `step-${index}`,
    _type: 'mapStep',
    etape_titre,
  }));
}

export function galleryImages(paths) {
  return paths.map((gallery_item) => ({ gallery_item }));
}

export function agenceStats(items) {
  return items.map(([stat_data, stat_legend], index) => ({
    _key: `stat-${index}`,
    _type: 'agenceStat',
    stat_data,
    stat_legend,
  }));
}

const DEFAULT_PROJECT_KEYWORDS = [
  'Website',
  'Films & Photos',
  'Print assets',
  'Community Management',
  'SEO',
  'Brand Design',
  'Partnerships',
  'Meta & Google Ads',
];

const DEFAULT_PROJECT_DESCRIPTION =
  'Creation of a new Brand experience & website, with an immersive design and SEO optimization. A high-performance ad campaign generated a ROAS of 76.4, supported by photo & video coverage to enhance online visibility.';

/**
 * Compact project entry → full realisation object for /realisations pages.
 * @param {object} p
 * @param {string} p.slug — URL slug (must be unique, lowercase-with-dashes)
 * @param {string} p.title — Project name shown on site
 * @param {string} p.cover — Cover image/video path under /public
 * @param {'image'|'video'} [p.coverType='image']
 * @param {string[]} p.gallery — Gallery image paths
 * @param {[string,string][]} [p.stats] — [value, label] pairs
 * @param {string} [p.description]
 * @param {string[]} [p.categories]
 * @param {string|null} [p.videoUrl='']
 */
export function buildProject({
  slug,
  title,
  cover,
  coverType = 'image',
  gallery,
  stats = [
    ['+24%', 'Additional income'],
    ['2025', 'Project year'],
    ['+60%', 'Web & Social traffic'],
  ],
  description = DEFAULT_PROJECT_DESCRIPTION,
  categories = ['Hotels'],
  videoUrl = '',
}) {
  return {
    slug,
    title,
    categories,
    highlightCover: cover,
    acf: {
      _type: 'realisationFields',
      realisation_cover: {
        _type: 'linkAsset',
        mediaType: coverType,
        url: cover,
      },
      realisation_description: description,
      realisation_gallerie: gallery.map((url, index) => ({
        _key: `gallery-${slug}-${index}`,
        _type: 'realisationGalleryImage',
        gallerie_image: {
          _type: 'linkAsset',
          mediaType: 'image',
          url,
        },
      })),
      realisation_keywords: DEFAULT_PROJECT_KEYWORDS.map((realisation_keyword, index) => ({
        _key: `kw-${slug}-${index}`,
        _type: 'realisationKeyword',
        realisation_keyword,
      })),
      realisation_statistiques: stats.map(([statistique_data, statistique_legend], index) => ({
        _key: `stat-${slug}-${index}`,
        _type: 'realisationStat',
        statistique_data,
        statistique_legend,
      })),
      realisation_video: {
        _type: 'linkAsset',
        mediaType: 'video',
        url: videoUrl,
      },
    },
  };
}

export function legalSectionsToHtml(sections) {
  return sections
    .map(({ heading, body }) => `<h2>${heading}</h2><p>${body}</p>`)
    .join('');
}
