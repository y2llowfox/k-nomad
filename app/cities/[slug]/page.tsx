import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getCityBySlug,
  getReviewsForCity,
  getCoworkingsForCity,
  getNearbyCities,
} from "@/lib/data";
import { getCurrentUser, getUserTier } from "@/lib/auth-utils";
import CityHero from "@/components/city/CityHero";
import CityTabs from "@/components/city/CityTabs";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) return { title: "도시를 찾을 수 없습니다" };
  return {
    title: `${city.name} — K-Nomad 디지털 노마드 가이드`,
    description: city.description,
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const [reviews, coworkings, nearbyCities, user] = await Promise.all([
    getReviewsForCity(slug),
    getCoworkingsForCity(slug),
    getNearbyCities(slug),
    getCurrentUser(),
  ]);

  const tier = getUserTier(user);

  return (
    <>
      <CityHero city={city} reviewCount={reviews.length || city.reviewCount} />
      <CityTabs
        city={city}
        reviews={reviews}
        coworkings={coworkings}
        nearbyCities={nearbyCities}
        userTier={tier}
      />
    </>
  );
}
