'use client';

import Link from 'next/link';
import ArrowIcon from '@/components/shared/ArrowIcon';
import useIsMobile from '@/hooks/useIsMobile';

export default function RejoindreOffres({ jobs = [] }) {
  const isMobile = useIsMobile();

  return (
    <div className="rejoindre-offres">
      {jobs.map((job, index) => (
        <Link
          href={job.link_job?.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="offre-item"
          key={index}
        >
          <div className="offre-bg" />
          <div className="offre-container">
            <h6>{job.title_job}</h6>
            <ul className="offre-tags">
              {(job.link_tags || []).map((tag, i) => (
                <li key={i}>{tag.tag}</li>
              ))}
            </ul>
          </div>
          {!isMobile && (
            <div className="offre-arrow">
              <ArrowIcon className="no-fill" />
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
