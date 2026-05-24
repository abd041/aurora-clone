import { notFound } from 'next/navigation';
import { realisations } from '@/data/content';
import RealisationDetailClient from '@/components/realisations/RealisationDetailClient';

export async function generateStaticParams() {
  return realisations.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = realisations.find((r) => r.slug === slug);
  const desc = project?.acf?.realisation_description;
  return {
    title: project ? `${project.title} - Aurora` : 'Project - Aurora',
    description: desc || 'Discover this Aurora realisation.',
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
