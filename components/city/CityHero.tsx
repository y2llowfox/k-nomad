import Link from "next/link";
import { City } from "@/lib/types";
import ScoreBadge from "@/components/shared/ScoreBadge";
import { Button } from "@/components/ui/button";

interface CityHeroProps {
  city: City;
  reviewCount: number;
}

export default function CityHero({ city, reviewCount }: CityHeroProps) {
  return (
    <div
      className="relative h-[320px] md:h-[400px] bg-cover bg-center"
      style={{ backgroundImage: `url(${city.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm mb-1">{city.region}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {city.name}
              <span className="text-lg font-normal text-white/60 ml-2">
                {city.nameEn}
              </span>
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <ScoreBadge score={city.overallScore} size="lg" />
              <span className="text-white/80 text-sm">
                리뷰 {reviewCount}개
              </span>
              <span className="text-white/80 text-sm">
                📡 {city.internetSpeed}Mbps
              </span>
              <span className="text-white/80 text-sm">
                {city.weatherIcon} {city.currentTemp}°C
              </span>
              <span className="text-white/80 text-sm">
                💰 {city.monthlyCost}만원/월
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link href={`/review/${city.slug}`}>
              <Button variant="secondary" size="sm">
                리뷰 작성
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
