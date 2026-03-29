import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCityBySlug } from "@/lib/data";
import CityDetail from "@/components/city/CityDetail";

export const revalidate = 10; // 10초마다 재생성

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await getCityBySlug(params.slug);
  if (!city) return { title: "도시를 찾을 수 없습니다" };

  return {
    title: `${city.name} (${city.nameEn}) - K-Nomad`,
    description: city.description,
  };
}

export default async function CityPage({ params }: Props) {
  const city = await getCityBySlug(params.slug);

  if (!city) {
    notFound();
  }

  return <CityDetail city={city} />;
}
