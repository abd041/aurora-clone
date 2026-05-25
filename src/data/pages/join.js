/**
 * JOIN US PAGE (/nous-rejoindre) — hero, job listings.
 *
 * To add a job: copy an existing entry and change title, tags, and link_job.url.
 * link_job.url is the external application link.
 */

export const join = {
  hero_td_titre: 'Join us',
  hero_td_desc:
    "We're a team of passionate creatives, strategists and storytellers shaping the future of luxury outdoor hospitality. If you believe in bold ideas, meaningful design and unforgettable experiences you might just belong here. Come write the next chapter with us.",
  marquee_word: 'Job openings',

  jobs: [
    {
      title_job: 'Senior 360 Art Director',
      link_job: { url: 'lab' },
      link_tags: [
        { tag: 'Our offer' },
        { tag: 'In-person' },
        { tag: 'Open-ended contract' },
      ],
    },
    {
      title_job: 'Key Account Sales Representative Offset and Digital Printing M/F',
      link_job: { url: 'kay' },
      link_tags: [
        { tag: 'Partial remote' },
        { tag: 'Open-ended contract' },
        { tag: 'Lot of Money' },
      ],
    },
    {
      title_job: 'WordPress Front-End Developer',
      link_job: { url: 'front' },
      link_tags: [
        { tag: 'Dev' },
        { tag: 'Full Remote' },
        { tag: 'Open-ended contract' },
      ],
    },
  ],
};
