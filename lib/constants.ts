import { Region } from "./types";

export const REGIONS: Region[] = [
  "서울/경기",
  "강원",
  "충청",
  "전라",
  "경상",
  "제주",
];

export const BUDGET_RANGES = [
  { value: "80", label: "~80만원" },
  { value: "120", label: "80~120만원" },
  { value: "160", label: "120~160만원" },
  { value: "160+", label: "160만원~" },
] as const;

export const ENVIRONMENTS = ["바다", "산·자연", "도심", "소도시"] as const;

export const SEASONS = ["봄", "여름", "가을", "겨울"] as const;
