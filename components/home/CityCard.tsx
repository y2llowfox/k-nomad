"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { City } from "@/lib/types";

interface CityCardProps {
  city: City;
}

export default function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/cities/${city.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group">
        {/* Image */}
        <div
          className="h-36 bg-cover bg-center"
          style={{ backgroundImage: `url(${city.imageUrl})` }}
        />

        {/* Info */}
        <div className="p-3 space-y-2">
          {/* City Name */}
          <div>
            <h3 className="font-bold text-base">{city.name}</h3>
            <p className="text-xs text-muted-foreground">{city.nameEn}</p>
          </div>

          <div className="border-t pt-2 space-y-1">
            {/* Budget + Region */}
            <div className="flex justify-between text-sm">
              <span>💰 {city.monthlyCost}만원/월</span>
              <span>📍 {city.region}</span>
            </div>
            {/* Environment + Season */}
            <div className="flex justify-between text-sm">
              <span>🌿 {city.environment.join(", ") || "-"}</span>
              <span>🌸 {city.bestSeason.join(", ") || "-"}</span>
            </div>
          </div>

          {/* Likes / Dislikes */}
          <div className="border-t pt-2 flex justify-between text-sm">
            <span>👍 {city.likes}</span>
            <span>👎 {city.dislikes}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
