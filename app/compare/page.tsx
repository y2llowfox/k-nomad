import { getAllCities, compareCities } from "@/lib/data";
import CitySelector from "@/components/compare/CitySelector";
import ComparisonTable from "@/components/compare/ComparisonTable";

interface ComparePageProps {
  searchParams: Promise<{ cities?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const slugs = params.cities
    ? params.cities.split(",").filter(Boolean)
    : [];
  const allCities = await getAllCities();
  const selectedCities = slugs.length > 0 ? await compareCities(slugs) : [];

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">도시 비교</h1>
      <p className="text-muted-foreground mb-6">
        최대 3개 도시를 선택하여 항목별로 비교해보세요
      </p>

      <CitySelector
        allCities={allCities.map((c) => ({ slug: c.slug, name: c.name }))}
        selectedSlugs={slugs}
      />

      {selectedCities.length > 0 ? (
        <ComparisonTable cities={selectedCities} />
      ) : (
        <div className="mt-12 text-center py-16 border border-dashed rounded-lg">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-medium text-muted-foreground">
            비교할 도시를 선택해주세요
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            위 셀렉트 박스에서 2~3개 도시를 선택하면 비교표가 나타납니다
          </p>
        </div>
      )}
    </main>
  );
}
