"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CitySelectorProps {
  allCities: { slug: string; name: string }[];
  selectedSlugs: string[];
}

export default function CitySelector({
  allCities,
  selectedSlugs,
}: CitySelectorProps) {
  const router = useRouter();

  const [slots, setSlots] = useState<string[]>(() => {
    const initial = [...selectedSlugs];
    while (initial.length < 2) initial.push("");
    return initial.slice(0, 3);
  });

  const slotCount = slots.length;

  useEffect(() => {
    const initial = [...selectedSlugs];
    while (initial.length < 2) initial.push("");
    if (initial.length > 3) initial.length = 3;
    setSlots(initial);
  }, [selectedSlugs]);

  function updateUrl(newSlots: string[]) {
    const filled = newSlots.filter(Boolean);
    if (filled.length === 0) {
      router.push("/compare");
    } else {
      router.push(`/compare?cities=${filled.join(",")}`);
    }
  }

  function handleSlotChange(index: number, value: string) {
    const newSlots = [...slots];
    newSlots[index] = value;
    setSlots(newSlots);
    updateUrl(newSlots);
  }

  function addSlot() {
    if (slotCount < 3) {
      const newSlots = [...slots, ""];
      setSlots(newSlots);
    }
  }

  function clearAll() {
    const newSlots = ["", ""];
    setSlots(newSlots);
    router.push("/compare");
  }

  function getAvailableCities(currentIndex: number) {
    const otherSelected = slots.filter(
      (s, i) => i !== currentIndex && s !== ""
    );
    return allCities.filter((c) => !otherSelected.includes(c.slug));
  }

  return (
    <div className="flex flex-wrap items-end gap-3 mb-8">
      {slots.map((slug, index) => (
        <div key={index} className="w-48">
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            도시 {index + 1}
          </label>
          <Select
            value={slug || undefined}
            onValueChange={(val) => handleSlotChange(index, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="도시 선택" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableCities(index).map((city) => (
                <SelectItem key={city.slug} value={city.slug}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      {slotCount < 3 && (
        <Button variant="outline" size="sm" onClick={addSlot}>
          + 도시 추가
        </Button>
      )}

      <Button variant="ghost" size="sm" onClick={clearAll}>
        초기화
      </Button>
    </div>
  );
}
