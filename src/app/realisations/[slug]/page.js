import { notFound } from 'next/navigation';
import { realisations } from '@/data/content';
import RealisationDetailClient from '@/components/realisations/RealisationDetailClient';
import { projectPageTitle } from '@/lib/siteMeta';
import { site } from '@/data/site';

export async function generateStaticParams() {
  return realisations.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = realisations.find((r) => r.slug === slug);
  const desc = project?.acf?.realisation_description;
  return {
    title: projectPageTitle(project?.title),
    description: desc || site.seo.defaultDescription,
  };
}

export default async function RealisationDetailPage({ params }) {
  const { slug } = await params;
  const project = realisations.find((r) => r.slug === slug);
  if (!project) notFound();

  const similar = realisations
    .filter((r) => r.slug !== slug)
    .slice(0, 10);

  return <RealisationDetailClient project={project} similar={similar} />;
}
