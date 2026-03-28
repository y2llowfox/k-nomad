import { NextResponse } from "next/server";
import { filterCities } from "@/lib/data";
import { FilterParams } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: FilterParams = {
    region: searchParams.get("region") ?? undefined,
    maxCost: searchParams.get("maxCost") ?? undefined,
    minInternet: searchParams.get("minInternet") ?? undefined,
    hasKTX: searchParams.get("hasKTX") ?? undefined,
    isSeaside: searchParams.get("isSeaside") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  };

  const cities = await filterCities(params);
  return NextResponse.json(cities);
}
