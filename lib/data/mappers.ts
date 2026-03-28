import type { Prisma } from "@prisma/client";
import type {
  City,
  MetricScore,
  CostItem,
  ProConTag,
  MonthlyWeather,
  Review,
  CoworkingSpace,
  WorkationProgram,
  Meetup,
} from "@/lib/types";

// Prisma composite types
type CityWithRelations = Prisma.CityGetPayload<{
  include: {
    metrics: true;
    costs: true;
    highlights: true;
    tags: true;
    weather: true;
    photos: true;
    nearbyFrom: true;
  };
}>;

type CityWithCard = Prisma.CityGetPayload<{
  include: {
    metrics: true;
    highlights: true;
  };
}>;

type DbMetric = Prisma.CityMetricGetPayload<Record<string, never>>;
type DbCost = Prisma.CostItemGetPayload<Record<string, never>>;
type DbTag = Prisma.ProConTagGetPayload<Record<string, never>>;
type DbWeather = Prisma.MonthlyWeatherGetPayload<Record<string, never>>;
type DbReview = Prisma.ReviewGetPayload<Record<string, never>>;
type DbCoworking = Prisma.CoworkingSpaceGetPayload<Record<string, never>>;
type DbProgram = Prisma.WorkationProgramGetPayload<Record<string, never>>;
type DbMeetup = Prisma.MeetupGetPayload<Record<string, never>>;

export function mapCity(raw: CityWithRelations): City {
  return {
    slug: raw.slug,
    name: raw.name,
    nameEn: raw.nameEn,
    region: raw.region as City["region"],
    category: raw.category as City["category"],
    description: raw.description,
    imageUrl: raw.imageUrl,
    overallScore: raw.overallScore,
    reviewCount: raw.reviewCount,
    metrics: raw.metrics.map(mapMetric),
    costs: raw.costs.map(mapCost),
    monthlyCost: raw.monthlyCost,
    internetSpeed: raw.internetSpeed,
    currentTemp: raw.currentTemp,
    weatherIcon: raw.weatherIcon,
    hasKTX: raw.hasKTX,
    isSeaside: raw.isSeaside,
    highlights: raw.highlights.map((h) => h.text),
    pros: raw.tags.filter((t) => t.type === "pro").map(mapProCon),
    cons: raw.tags.filter((t) => t.type === "con").map(mapProCon),
    weather: raw.weather.map(mapWeather),
    nearbySlugs: raw.nearbyFrom.map((n) => n.toSlug),
    photos: raw.photos.map((p) => p.url),
  };
}

export function mapCityCard(raw: CityWithCard): City {
  return {
    slug: raw.slug,
    name: raw.name,
    nameEn: raw.nameEn,
    region: raw.region as City["region"],
    category: raw.category as City["category"],
    description: raw.description,
    imageUrl: raw.imageUrl,
    overallScore: raw.overallScore,
    reviewCount: raw.reviewCount,
    metrics: raw.metrics.map(mapMetric),
    costs: [],
    monthlyCost: raw.monthlyCost,
    internetSpeed: raw.internetSpeed,
    currentTemp: raw.currentTemp,
    weatherIcon: raw.weatherIcon,
    hasKTX: raw.hasKTX,
    isSeaside: raw.isSeaside,
    highlights: raw.highlights.map((h) => h.text),
    pros: [],
    cons: [],
    weather: [],
    nearbySlugs: [],
    photos: [],
  };
}

function mapMetric(raw: DbMetric): MetricScore {
  return {
    key: raw.key as MetricScore["key"],
    label: raw.label,
    emoji: raw.emoji,
    score: raw.score,
    detail: raw.detail ?? undefined,
  };
}

function mapCost(raw: DbCost): CostItem {
  return {
    category: raw.category,
    amount: raw.amount,
    unit: raw.unit,
  };
}

function mapProCon(raw: DbTag): ProConTag {
  return {
    id: raw.id,
    text: raw.text,
    emoji: raw.emoji,
    type: raw.type as "pro" | "con",
    votes: raw.votes,
  };
}

function mapWeather(raw: DbWeather): MonthlyWeather {
  return {
    month: raw.month,
    avgTemp: raw.avgTemp,
    rainfall: raw.rainfall,
    humidity: raw.humidity,
  };
}

export function mapReview(raw: DbReview): Review {
  return {
    id: raw.id,
    authorNickname: raw.authorNickname,
    visitPeriod: raw.visitPeriod,
    duration: raw.duration,
    profession: raw.profession,
    overallScore: raw.overallScore,
    text: raw.text,
    recommendation: raw.recommendation as Review["recommendation"],
    createdAt: raw.createdAt instanceof Date
      ? raw.createdAt.toISOString().split("T")[0]
      : String(raw.createdAt),
    helpful: raw.helpful,
    unhelpful: raw.unhelpful,
  };
}

export function mapCoworking(raw: DbCoworking): CoworkingSpace {
  return {
    id: raw.id,
    name: raw.name,
    address: raw.address,
    dailyPrice: raw.dailyPrice,
    monthlyPrice: raw.monthlyPrice ?? undefined,
    amenities: typeof raw.amenities === "string"
      ? JSON.parse(raw.amenities)
      : raw.amenities,
    hours: raw.hours,
    rating: raw.rating,
    imageUrl: raw.imageUrl,
  };
}

export function mapProgram(raw: DbProgram): WorkationProgram {
  return {
    id: raw.id,
    title: raw.title,
    city: raw.citySlug,
    period: raw.period,
    subsidy: raw.subsidy,
    description: raw.description,
  };
}

export function mapMeetup(raw: DbMeetup): Meetup {
  return {
    id: raw.id,
    date: raw.date,
    city: raw.citySlug,
    title: raw.title,
    attendees: raw.attendees,
  };
}
