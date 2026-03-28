import Image from "next/image";
import { CoworkingSpace } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CoworkingTabProps {
  coworkings: CoworkingSpace[];
  cityName: string;
}

export default function CoworkingTab({ coworkings, cityName }: CoworkingTabProps) {
  if (coworkings.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed rounded-lg">
        <p className="text-4xl mb-4">🏢</p>
        <p className="text-lg font-medium text-muted-foreground">
          {cityName}의 코워킹 정보가 아직 없습니다
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          코워킹 스페이스 정보를 제보해 주세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coworkings.map((space) => (
        <Card key={space.id} className="overflow-hidden">
          <div className="relative h-40">
            <Image
              src={space.imageUrl}
              alt={space.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm">{space.name}</h3>
              <Badge variant="secondary" className="shrink-0">
                ⭐ {space.rating}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">{space.address}</p>

            <div className="flex items-center gap-3 text-xs">
              {space.dailyPrice === 0 ? (
                <span className="text-emerald-600 font-semibold">무료</span>
              ) : (
                <span>일 ₩{space.dailyPrice.toLocaleString()}</span>
              )}
              {space.monthlyPrice !== undefined && space.monthlyPrice > 0 && (
                <span className="text-muted-foreground">
                  월 ₩{space.monthlyPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground">🕐 {space.hours}</p>

            <div className="flex flex-wrap gap-1">
              {space.amenities.map((a) => (
                <Badge key={a} variant="outline" className="text-xs px-1.5 py-0">
                  {a}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
