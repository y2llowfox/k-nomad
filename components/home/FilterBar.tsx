"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGIONS, BUDGET_RANGES, ENVIRONMENTS, SEASONS } from "@/lib/constants";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push("/");
  }, [router]);

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="bg-background border-b sticky top-14 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Budget */}
          <Select
            value={searchParams.get("maxCost") ?? "all"}
            onValueChange={(v) => updateParam("maxCost", v)}
          >
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder="💰 예산" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">💰 전체</SelectItem>
              {BUDGET_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Region */}
          <Select
            value={searchParams.get("region") ?? "all"}
            onValueChange={(v) => updateParam("region", v)}
          >
            <SelectTrigger className="w-[120px] h-9 text-sm">
              <SelectValue placeholder="📍 지역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">📍 전체</SelectItem>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Environment */}
          <Select
            value={searchParams.get("environment") ?? "all"}
            onValueChange={(v) => updateParam("environment", v)}
          >
            <SelectTrigger className="w-[120px] h-9 text-sm">
              <SelectValue placeholder="🌿 환경" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌿 전체</SelectItem>
              {ENVIRONMENTS.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Season */}
          <Select
            value={searchParams.get("bestSeason") ?? "all"}
            onValueChange={(v) => updateParam("bestSeason", v)}
          >
            <SelectTrigger className="w-[120px] h-9 text-sm">
              <SelectValue placeholder="🌸 계절" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌸 전체</SelectItem>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-sm text-muted-foreground"
              onClick={clearFilters}
            >
              ✕ 초기화
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
