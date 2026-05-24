'use client';

import RealisationHead from '@/components/realisations/RealisationHead';
import RealisationStats from '@/components/realisations/RealisationStats';
import RealisationPlayer from '@/components/realisations/RealisationPlayer';
import RealisationGallery from '@/components/realisations/RealisationGallery';
import RealisationSimilaires from '@/components/realisations/RealisationSimilaires';
import { RealisationSimilarLogoClip } from '@/components/realisations/RealisationLogoClip';

export default function RealisationDetailClient({ project, similar = [] }) {
  if (!project) return null;

  const acf = project.acf || {};
  const cover = acf.realisation_cover || project.highlightCover;
  const videoRaw = acf.realisation_video;
  const videoUrl =
    videoRaw?.url ||
    videoRaw?.video?.url ||
    (typeof videoRaw === 'string' ? videoRaw : '');

  return (
    <main className="realisation">
      <RealisationHead
        cover={cover}
        title={project.title}
        categories={project.categories || []}
      />
      <RealisationStats
        description={acf.realisation_description}
        keywords={acf.realisation_keywords || []}
        stats={acf.realisation_statistiques || []}
      />
      {videoUrl ? <RealisationPlayer videoUrl={videoUrl} /> : null}
      {acf.realisation_gallerie?.length > 0 ? (
        <RealisationGallery gallery={acf.realisation_gallerie} />
      ) : null}
      <RealisationSimilaires realisations={similar} />
      <RealisationSimilarLogoClip />
    </main>
  );
}
