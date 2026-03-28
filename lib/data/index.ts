import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { City, FilterParams } from "@/lib/types";
import { mapCityCard } from "./mappers";

const CARD_INCLUDE = {
  metrics: true,
  highlights: true,
} satisfies Prisma.CityInclude;

export async function getAllCities(): Promise<City[]> {
  const raw = await prisma.city.findMany({
    include: CARD_INCLUDE,
    orderBy: { overallScore: "desc" },
  });
  return raw.map(mapCityCard);
}

export async function filterCities(params: FilterParams): Promise<City[]> {
  const where: Prisma.CityWhereInput = {};

  if (params.region && params.region !== "all") {
    where.region = params.region;
  }

  if (params.maxCost && params.maxCost !== "all") {
    const maxCost = Number(params.maxCost);
    if (!isNaN(maxCost)) {
      where.monthlyCost = { lte: maxCost };
    }
  }

  if (params.minInternet && params.minInternet !== "all") {
    const minInternet = Number(params.minInternet);
    if (!isNaN(minInternet)) {
      where.internetSpeed = { gte: minInternet };
    }
  }

  if (params.hasKTX === "true") {
    where.hasKTX = true;
  }

  if (params.isSeaside === "true") {
    where.isSeaside = true;
  }

  const raw = await prisma.city.findMany({
    where,
    include: CARD_INCLUDE,
    orderBy: { overallScore: "desc" },
  });

  return raw.map(mapCityCard);
}
