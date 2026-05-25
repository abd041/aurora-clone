/**
 * LEGAL PAGE (/mentions-legales).
 * Edit the sections below — each has a heading and body paragraph.
 */

import { legalSectionsToHtml } from './helpers.js';

const sections = [
  {
    heading: 'Éditeur du site',
    body: "Le site aurora-agency.ovh est édité par Aurora Agency, agence de communication spécialisée dans l'hôtellerie outdoor de luxe.",
  },
  {
    heading: 'Directeur de la publication',
    body: 'Aurora Agency',
  },
  {
    heading: 'Hébergement',
    body: 'Le site est hébergé par un prestataire conforme aux exigences de disponibilité et de sécurité applicables au service.',
  },
  {
    heading: 'Propriété intellectuelle',
    body: "L'ensemble des contenus présents sur ce site (textes, visuels, vidéos, identité graphique, structure et code) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation préalable est interdite.",
  },
  {
    heading: 'Données personnelles',
    body: "Les données transmises via le formulaire de contact sont utilisées uniquement pour répondre à votre demande. Conformément à la réglementation applicable, vous disposez d'un droit d'accès, de rectification et de suppression en contactant Aurora Agency.",
  },
  {
    heading: 'Cookies',
    body: 'Le site peut utiliser des cookies strictement nécessaires à son fonctionnement et à la mesure d\'audience. Vous pouvez configurer votre navigateur pour limiter leur dépôt.',
  },
  {
    heading: 'Contact',
    body: 'Pour toute question relative aux mentions légales, veuillez utiliser le <a href="/contact">formulaire de contact</a>.',
  },
];

export const legal = {
  legal_title: 'Mentions légales',
  /** Readable sections — edit these */
  sections,
  /** Auto-built HTML consumed by the page (do not edit directly) */
  legal_content: legalSectionsToHtml(sections),
};
