import Image from "next/image";
import { City } from "@/lib/types";
import { METRICS } from "@/lib/constants";
import { getScoreColor, getScoreTextColor, cn } from "@/lib/utils";

interface ComparisonTableProps {
  cities: City[];
}

export default function ComparisonTable({ cities }: ComparisonTableProps) {
  function getMetricScore(city: City, key: string): number {
    return city.metrics.find((m) => m.key === key)?.score ?? 0;
  }

  function getHighestIndex(scores: number[]): number {
    let maxIdx = 0;
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] > scores[maxIdx]) maxIdx = i;
    }
    return maxIdx;
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Header: City images + names + overall score */}
        <thead>
          <tr className="border-b">
            <th className="text-left py-4 px-3 w-36 text-sm font-medium text-muted-foreground">
              항목
            </th>
            {cities.map((city) => (
              <th key={city.slug} className="py-4 px-3 text-center min-w-[180px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted relative">
                    <Image
                      src={city.imageUrl}
                      alt={city.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-semibold text-base">{city.name}</span>
                  <span
                    className={cn(
                      "text-2xl font-bold",
                      getScoreTextColor(city.overallScore)
                    )}
                  >
                    {city.overallScore.toFixed(1)}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Info rows */}
          <tr className="border-b bg-muted/30">
            <td className="py-3 px-3 text-sm font-medium">월 생활비</td>
            {cities.map((city) => {
              const costs = cities.map((c) => c.monthlyCost);
              const minIdx = costs.indexOf(Math.min(...costs));
              const isMin = cities.indexOf(city) === minIdx;
              return (
                <td
                  key={city.slug}
                  className={cn(
                    "py-3 px-3 text-center text-sm font-medium",
                    isMin && "bg-emerald-50 dark:bg-emerald-950/30"
                  )}
                >
                  {city.monthlyCost}만원
                </td>
              );
            })}
          </tr>

          <tr className="border-b bg-muted/30">
            <td className="py-3 px-3 text-sm font-medium">인터넷 속도</td>
            {cities.map((city) => {
              const speeds = cities.map((c) => c.internetSpeed);
              const highIdx = getHighestIndex(speeds);
              const isHighest = cities.indexOf(city) === highIdx;
              return (
                <td
                  key={city.slug}
                  className={cn(
                    "py-3 px-3 text-center text-sm font-medium",
                    isHighest && "bg-emerald-50 dark:bg-emerald-950/30"
                  )}
                >
                  {city.internetSpeed}Mbps
                </td>
              );
            })}
          </tr>

          <tr className="border-b bg-muted/30">
            <td className="py-3 px-3 text-sm font-medium">리뷰 수</td>
            {cities.map((city) => {
              const counts = cities.map((c) => c.reviewCount);
              const highIdx = getHighestIndex(counts);
              const isHighest = cities.indexOf(city) === highIdx;
              return (
                <td
                  key={city.slug}
                  className={cn(
                    "py-3 px-3 text-center text-sm font-medium",
                    isHighest && "bg-emerald-50 dark:bg-emerald-950/30"
                  )}
                >
                  {city.reviewCount}개
                </td>
              );
            })}
          </tr>

          {/* Metric rows */}
          {METRICS.map((metric) => {
            const scores = cities.map((city) =>
              getMetricScore(city, metric.key)
            );
            const highestIdx = getHighestIndex(scores);

            return (
              <tr key={metric.key} className="border-b hover:bg-muted/20">
                <td className="py-3 px-3 text-sm font-medium whitespace-nowrap">
                  {metric.emoji} {metric.label}
                </td>
                {cities.map((city, idx) => {
                  const score = scores[idx];
                  const isHighest = idx === highestIdx && scores.filter((s) => s === score).length === 1;
                  const percentage = (score / 5) * 100;

                  return (
                    <td
                      key={city.slug}
                      className={cn(
                        "py-3 px-3",
                        isHighest && "bg-emerald-50 dark:bg-emerald-950/30"
                      )}
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            getScoreTextColor(score)
                          )}
                        >
                          {score.toFixed(1)}
                        </span>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden max-w-[120px]">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              getScoreColor(score)
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
