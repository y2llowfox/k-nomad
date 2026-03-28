import Link from "next/link";
import { City } from "@/lib/types";
import { Card } from "@/components/ui/card";
import ScoreBadge from "@/components/shared/ScoreBadge";

interface NearbyTabProps {
  cities: City[];
}

export default function NearbyTab({ cities }: NearbyTabProps) {
  if (cities.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed rounded-lg">
        <p className="text-4xl mb-4">🗺️</p>
        <p className="text-lg font-medium text-muted-foreground">
          주변 도시 정보가 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cities.map((city) => (
        <Link key={city.slug} href={`/cities/${city.slug}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div
              className="h-32 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${city.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3">
                <p className="text-white font-semibold text-sm">{city.name}</p>
                <p className="text-white/70 text-xs">{city.region}</p>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>📡 {city.internetSpeed}Mbps</p>
                <p>💰 {city.monthlyCost}만원/월</p>
              </div>
              <ScoreBadge score={city.overallScore} size="sm" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
