import { site } from '@/data/site';

/** Page title for <title> tags — e.g. pageTitle('Contact') → "Contact - Aurora" */
export function pageTitle(pageName) {
  return `${pageName} - ${site.seo.titleSuffix}`;
}

export function projectPageTitle(projectTitle) {
  return projectTitle
    ? `${projectTitle} - ${site.seo.titleSuffix}`
    : `Project - ${site.seo.titleSuffix}`;
}
