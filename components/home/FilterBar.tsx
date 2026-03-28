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
import { REGIONS, SORT_OPTIONS, COST_RANGES, INTERNET_RANGES } from "@/lib/constants";

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
          {/* Region */}
          <Select
            value={searchParams.get("region") ?? "all"}
            onValueChange={(v) => updateParam("region", v)}
          >
            <SelectTrigger className="w-[120px] h-9 text-sm">
              <SelectValue placeholder="지역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 지역</SelectItem>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Cost */}
          <Select
            value={searchParams.get("maxCost") ?? "all"}
            onValueChange={(v) => updateParam("maxCost", v)}
          >
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder="생활비" />
            </SelectTrigger>
            <SelectContent>
              {COST_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Internet */}
          <Select
            value={searchParams.get("minInternet") ?? "all"}
            onValueChange={(v) => updateParam("minInternet", v)}
          >
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="인터넷" />
            </SelectTrigger>
            <SelectContent>
              {INTERNET_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* KTX */}
          <Button
            variant={searchParams.get("hasKTX") === "true" ? "default" : "outline"}
            size="sm"
            className="h-9 text-sm"
            onClick={() =>
              updateParam(
                "hasKTX",
                searchParams.get("hasKTX") === "true" ? "" : "true"
              )
            }
          >
            🚆 KTX
          </Button>

          {/* Seaside */}
          <Button
            variant={searchParams.get("isSeaside") === "true" ? "default" : "outline"}
            size="sm"
            className="h-9 text-sm"
            onClick={() =>
              updateParam(
                "isSeaside",
                searchParams.get("isSeaside") === "true" ? "" : "true"
              )
            }
          >
            🌊 바다
          </Button>

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

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort */}
          <Select
            value={searchParams.get("sort") ?? "overall"}
            onValueChange={(v) => updateParam("sort", v)}
          >
            <SelectTrigger className="w-[150px] h-9 text-sm">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
