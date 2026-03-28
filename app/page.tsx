import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import FilterBar from "@/components/home/FilterBar";
import CityGrid from "@/components/home/CityGrid";
import { filterCities } from "@/lib/data";
import { FilterParams } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: FilterParams;
}) {
  const cities = await filterCities(searchParams);

  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>
      <div className="container mx-auto px-4 py-6">
        <CityGrid cities={cities} />
      </div>
    </>
  );
}
