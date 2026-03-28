"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { City } from "@/lib/types";
import { formatCost, getScoreColor } from "@/lib/utils";

interface CityCardProps {
  city: City;
  rank: number;
}

const HOVER_METRICS = [
  { key: "overall", label: "종합", emoji: "⭐" },
  { key: "cost", label: "생활비", emoji: "💰" },
  { key: "internet", label: "인터넷", emoji: "📡" },
  { key: "safety", label: "안전", emoji: "👌" },
  { key: "transport", label: "교통", emoji: "🚆" },
  { key: "nature", label: "자연", emoji: "🌿" },
] as const;

export default function CityCard({ city, rank }: CityCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  function getMetricScore(key: string): number {
    if (key === "overall") return city.overallScore;
    const metric = city.metrics.find((m) => m.key === key);
    return metric?.score ?? 0;
  }

  return (
    <Link href={`/cities/${city.slug}`}>
      <Card
        className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Area */}
        <div
          className="h-36 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${city.imageUrl})` }}
        >
          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black/70 flex flex-col justify-center px-4 gap-1.5 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {HOVER_METRICS.map(({ key, label, emoji }) => {
              const score = getMetricScore(key);
              const percentage = (score / 5) * 100;
              return (
                <div key={key} className="flex items-center gap-2 text-white">
                  <span className="text-xs w-16 shrink-0">
                    {emoji} {label}
                  </span>
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${getScoreColor(score)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Area */}
        <div className="p-3 space-y-2">
          {/* Rank + Internet Speed */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-lg font-bold text-red-500">#{rank}</span>
              <div className="w-6 h-0.5 bg-red-500 mt-0.5" />
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">📡</span>
              <span className="text-sm font-semibold ml-1">
                {city.internetSpeed}
              </span>
              <span className="text-xs text-muted-foreground ml-0.5">Mbps</span>
            </div>
          </div>

          {/* City Name */}
          <div className="text-center py-1">
            <h3 className="font-bold text-base tracking-wide">{city.name}</h3>
            <p className="text-xs text-muted-foreground">{city.region}</p>
          </div>

          {/* Bottom: Temp + Tags + Cost */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span>{city.weatherIcon}</span>
              <span className="text-xs">{city.currentTemp}°</span>
              <span className="text-xs ml-1">
                {city.highlights.slice(0, 2).map((h, i) => (
                  <span key={i} className="mr-0.5">
                    {h.charAt(0) === "#" ? "🏷️" : ""}
                  </span>
                ))}
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold">
                {formatCost(city.monthlyCost)}
              </span>
              <span className="text-xs text-muted-foreground">/월</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
