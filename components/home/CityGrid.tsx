import CityCard from "./CityCard";
import { City } from "@/lib/types";

interface CityGridProps {
  cities: City[];
}

export default function CityGrid({ cities }: CityGridProps) {
  if (cities.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center text-muted-foreground">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-medium">조건에 맞는 도시가 없습니다</p>
          <p className="text-sm mt-1">필터를 변경해 보세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <p className="text-sm text-muted-foreground mb-4">
        총 {cities.length}개 도시
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map((city, index) => (
          <CityCard key={city.slug} city={city} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
