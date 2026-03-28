import Link from "next/link";
import { Card } from "@/components/ui/card";
import ScoreBadge from "./ScoreBadge";
import { City } from "@/lib/types";

interface CityCardMiniProps {
  city: City;
}

export default function CityCardMini({ city }: CityCardMiniProps) {
  return (
    <Link href={`/cities/${city.slug}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div
          className="h-24 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${city.imageUrl})` }}
        >
          <div className="absolute bottom-2 right-2">
            <ScoreBadge score={city.overallScore} size="sm" />
          </div>
        </div>
        <div className="p-3">
          <p className="font-semibold text-sm">{city.name}</p>
          <p className="text-xs text-muted-foreground">{city.region}</p>
        </div>
      </Card>
    </Link>
  );
}
