'use client';

import HomeHero from '@/components/home/HomeHero';
import HomeVideo from '@/components/home/HomeVideo';
import HomeOffers from '@/components/home/HomeOffers';
import HomeLogos from '@/components/home/HomeLogos';
import HomeMap from '@/components/home/HomeMap';
import HomeGallery from '@/components/home/HomeGallery';
import HomeSlider from '@/components/home/HomeSlider';
import HomeValeurs from '@/components/home/HomeValeurs';
import DoubleMarquee from '@/components/home/DoubleMarquee';
import IndexLogoClip from '@/components/home/IndexLogoClip';

export default function HomePageClient({ data, realisations }) {
  if (!data) return null;

  const sliderItems =
    realisations?.length > 0 ? realisations : [];
  const mainImage =
    data.mainImageGallery ||
    sliderItems[0]?.highlightCover ||
    null;

  return (
    <main className="index page">
      <IndexLogoClip />
      <HomeHero videoUrl={data.videoHeroHome?.url} />
      <div className="home-container">
        <HomeVideo
          title={data.titleHero}
          firstTitle={data.firstTitlePlayer}
          secondTitle={data.secondTitlePlayer}
          description={data.descriptionPlayer}
          video={data.videoPlayer?.url ?? data.videoPlayer}
        />
        <HomeOffers
          title={data.titleCards}
          offers={data.offers || []}
          cards={data.cardsHome || []}
        />
        <HomeLogos
          title={data.titleLogos}
          subtitle={data.descLogos}
          firstLogos={data.firstLogos || []}
          secondLogos={data.secondLogos || []}
        />
        <HomeMap
          title={data.titleAmbassadeurs}
          firstDesc={data.first_description}
          secondDesc={data.second_description}
          list={data.liste_des_etapes || []}
          cta={data.ctaAmbassadeurs}
          ctaLink="/contact"
          ambassadeurs={data.ambassadeurs || []}
        />
        <HomeGallery gallery={data.home_gallery || []} mainImage={mainImage} />
        <HomeSlider realisations={sliderItems} />
        <HomeValeurs />
        <DoubleMarquee gap={30} />
      </div>
    </main>
  );
}
