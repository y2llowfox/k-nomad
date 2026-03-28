import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  City,
  FilterParams,
  Review,
  CoworkingSpace,
  WorkationProgram,
  Meetup,
} from "@/lib/types";
import {
  mapCity,
  mapCityCard,
  mapReview,
  mapCoworking,
  mapProgram,
  mapMeetup,
} from "./mappers";

const CARD_INCLUDE = {
  metrics: true,
  highlights: true,
} satisfies Prisma.CityInclude;

const FULL_INCLUDE = {
  metrics: true,
  costs: true,
  highlights: true,
  tags: true,
  weather: { orderBy: { month: "asc" as const } },
  photos: true,
  nearbyFrom: true,
} satisfies Prisma.CityInclude;

export async function getAllCities(): Promise<City[]> {
  const raw = await prisma.city.findMany({
    include: CARD_INCLUDE,
    orderBy: { overallScore: "desc" },
  });
  return raw.map(mapCityCard);
}

export async function getCityBySlug(slug: string): Promise<City | undefined> {
  const raw = await prisma.city.findUnique({
    where: { slug },
    include: FULL_INCLUDE,
  });
  if (!raw) return undefined;
  return mapCity(raw);
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

  let orderBy: Prisma.CityOrderByWithRelationInput = { overallScore: "desc" };

  switch (params.sort) {
    case "cost-asc":
      orderBy = { monthlyCost: "asc" };
      break;
    case "internet-desc":
      orderBy = { internetSpeed: "desc" };
      break;
    case "reviews-desc":
      orderBy = { reviewCount: "desc" };
      break;
    case "safety-desc":
    case "nature-desc":
      // These require metric-based sorting — fetch all and sort in memory
      break;
    case "overall":
    default:
      orderBy = { overallScore: "desc" };
      break;
  }

  const needsMetricSort = params.sort === "safety-desc" || params.sort === "nature-desc";

  const raw = await prisma.city.findMany({
    where,
    include: CARD_INCLUDE,
    orderBy: needsMetricSort ? undefined : orderBy,
  });

  const result = raw.map(mapCityCard);

  if (params.sort === "safety-desc") {
    result.sort((a, b) => {
      const sa = a.metrics.find((m) => m.key === "safety")?.score ?? 0;
      const sb = b.metrics.find((m) => m.key === "safety")?.score ?? 0;
      return sb - sa;
    });
  } else if (params.sort === "nature-desc") {
    result.sort((a, b) => {
      const na = a.metrics.find((m) => m.key === "nature")?.score ?? 0;
      const nb = b.metrics.find((m) => m.key === "nature")?.score ?? 0;
      return nb - na;
    });
  }

  return result;
}

export async function compareCities(slugs: string[]): Promise<City[]> {
  const raw = await prisma.city.findMany({
    where: { slug: { in: slugs } },
    include: FULL_INCLUDE,
  });
  return raw.map(mapCity);
}

export async function getNearbyCities(slug: string): Promise<City[]> {
  const nearby = await prisma.cityNearby.findMany({
    where: { fromSlug: slug },
  });
  if (nearby.length === 0) return [];

  const raw = await prisma.city.findMany({
    where: { slug: { in: nearby.map((n) => n.toSlug) } },
    include: CARD_INCLUDE,
  });
  return raw.map(mapCityCard);
}

export async function getReviewsForCity(slug: string): Promise<Review[]> {
  const raw = await prisma.review.findMany({
    where: { citySlug: slug },
    orderBy: { createdAt: "desc" },
  });
  return raw.map(mapReview);
}

export async function getCoworkingsForCity(slug: string): Promise<CoworkingSpace[]> {
  const raw = await prisma.coworkingSpace.findMany({
    where: { citySlug: slug },
  });
  return raw.map(mapCoworking);
}

export async function getWorkationPrograms(): Promise<WorkationProgram[]> {
  const raw = await prisma.workationProgram.findMany();
  return raw.map(mapProgram);
}

export async function getMeetups(): Promise<Meetup[]> {
  const raw = await prisma.meetup.findMany();
  return raw.map(mapMeetup);
}
