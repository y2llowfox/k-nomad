import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import { getCityBySlug } from "@/lib/data";
import CityDetail from "@/components/city/CityDetail";

export const revalidate = 3600;

const getCity = cache((slug: string) => getCityBySlug(slug));

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await getCity(params.slug);
  if (!city) return { title: "도시를 찾을 수 없습니다" };

  return {
    title: `${city.name} (${city.nameEn}) - K-Nomad`,
    description: city.description,
  };
}

export default async function CityPage({ params }: Props) {
  const city = await getCity(params.slug);

  if (!city) {
    notFound();
  }

  return <CityDetail city={city} />;
}
