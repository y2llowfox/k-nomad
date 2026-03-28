export type Region = "서울/경기" | "강원" | "충청" | "전라" | "경상" | "제주";

export type MetricKey =
  | "internet"
  | "cost"
  | "transport"
  | "coworking"
  | "safety"
  | "food"
  | "nature"
  | "culture"
  | "medical"
  | "amenities"
  | "community"
  | "housing";

export interface MetricScore {
  key: MetricKey;
  label: string;
  emoji: string;
  score: number; // 1.0 – 5.0
  detail?: string;
}

export interface CostItem {
  category: string;
  amount: number;
  unit: string;
}

export interface CoworkingSpace {
  id: string;
  name: string;
  address: string;
  dailyPrice: number;
  monthlyPrice?: number;
  amenities: string[];
  hours: string;
  rating: number;
  imageUrl: string;
}

export interface ProConTag {
  id: string;
  text: string;
  emoji: string;
  type: "pro" | "con";
  votes: number;
}

export interface MonthlyWeather {
  month: number;
  avgTemp: number;
  rainfall: number;
  humidity: number;
}

export interface Review {
  id: string;
  authorNickname: string;
  visitPeriod: string;
  duration: string;
  profession: string;
  overallScore: number;
  text: string;
  recommendation: "추천" | "보통" | "비추천";
  createdAt: string;
  helpful: number;
  unhelpful: number;
}

export interface City {
  slug: string;
  name: string;
  nameEn: string;
  region: Region;
  category: "metropolis" | "workation" | "smalltown" | "satellite";
  description: string;
  imageUrl: string;
  overallScore: number;
  reviewCount: number;
  metrics: MetricScore[];
  costs: CostItem[];
  monthlyCost: number;
  internetSpeed: number;
  currentTemp: number;
  weatherIcon: string;
  hasKTX: boolean;
  isSeaside: boolean;
  highlights: string[];
  pros: ProConTag[];
  cons: ProConTag[];
  weather: MonthlyWeather[];
  nearbySlugs: string[];
  photos: string[];
}

export interface WorkationProgram {
  id: string;
  title: string;
  city: string;
  period: string;
  subsidy: string;
  description: string;
}

export interface Meetup {
  id: string;
  date: string;
  city: string;
  title: string;
  attendees: number;
}

export interface FilterParams {
  region?: string;
  maxCost?: string;
  minInternet?: string;
  hasKTX?: string;
  isSeaside?: string;
  sort?: string;
}
