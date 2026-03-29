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
    orderBy: { likes: "desc" },
  });
  return raw.map(mapCityCard);
}

export async function filterCities(params: FilterParams): Promise<City[]> {
  const where: Prisma.CityWhereInput = {};

  if (params.region && params.region !== "all") {
    where.region = params.region;
  }

  if (params.maxCost && params.maxCost !== "all") {
    if (params.maxCost === "160+") {
      where.monthlyCost = { gt: 160 };
    } else {
      const maxCost = Number(params.maxCost);
      if (!isNaN(maxCost)) {
        where.monthlyCost = { lte: maxCost };
      }
    }
  }

  if (params.environment && params.environment !== "all") {
    where.environment = { array_contains: [params.environment] };
  }

  if (params.bestSeason && params.bestSeason !== "all") {
    where.bestSeason = { array_contains: [params.bestSeason] };
  }

  const raw = await prisma.city.findMany({
    where,
    include: CARD_INCLUDE,
    orderBy: { likes: "desc" },
  });

  return raw.map(mapCityCard);
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const raw = await prisma.city.findUnique({
    where: { slug },
    include: {
      metrics: true,
      costs: true,
      highlights: true,
      tags: true,
      weather: true,
      photos: true,
      nearbyFrom: true,
    },
  });

  if (!raw) return null;

  const { mapCity } = await import("./mappers");
  return mapCity(raw);
}
