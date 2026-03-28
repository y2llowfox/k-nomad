import { MetricKey, Region } from "./types";

export const METRICS: { key: MetricKey; label: string; emoji: string }[] = [
  { key: "internet", label: "인터넷", emoji: "📡" },
  { key: "cost", label: "생활비", emoji: "💰" },
  { key: "transport", label: "교통", emoji: "🚆" },
  { key: "coworking", label: "코워킹", emoji: "🏢" },
  { key: "safety", label: "안전", emoji: "👌" },
  { key: "food", label: "먹거리", emoji: "🍽️" },
  { key: "nature", label: "자연환경", emoji: "🌿" },
  { key: "culture", label: "문화", emoji: "🎭" },
  { key: "medical", label: "의료", emoji: "🏥" },
  { key: "amenities", label: "편의시설", emoji: "📱" },
  { key: "community", label: "커뮤니티", emoji: "👥" },
  { key: "housing", label: "주거", emoji: "🏘️" },
];

export const REGIONS: Region[] = [
  "서울/경기",
  "강원",
  "충청",
  "전라",
  "경상",
  "제주",
];

export const SORT_OPTIONS = [
  { value: "overall", label: "노마드 점수순" },
  { value: "cost-asc", label: "생활비 낮은순" },
  { value: "internet-desc", label: "인터넷 빠른순" },
  { value: "safety-desc", label: "안전순" },
  { value: "nature-desc", label: "자연환경순" },
  { value: "reviews-desc", label: "리뷰 많은순" },
] as const;

export const COST_RANGES = [
  { value: "80", label: "80만원 이하" },
  { value: "120", label: "120만원 이하" },
  { value: "160", label: "160만원 이하" },
  { value: "all", label: "전체" },
] as const;

export const INTERNET_RANGES = [
  { value: "50", label: "50Mbps 이상" },
  { value: "100", label: "100Mbps 이상" },
  { value: "200", label: "200Mbps 이상" },
  { value: "all", label: "전체" },
] as const;

export const PRO_TAGS = [
  { emoji: "☀️", text: "날씨 좋음" },
  { emoji: "🌊", text: "바다 근접" },
  { emoji: "☕", text: "카페 많음" },
  { emoji: "💰", text: "물가 저렴" },
  { emoji: "🏢", text: "코워킹 좋음" },
  { emoji: "🍜", text: "먹거리 다양" },
  { emoji: "🧘", text: "힐링/워라밸" },
  { emoji: "👥", text: "모임 활발" },
  { emoji: "🚆", text: "교통 편리" },
  { emoji: "🌿", text: "자연 좋음" },
  { emoji: "🏛️", text: "문화 풍부" },
  { emoji: "🏥", text: "의료 좋음" },
  { emoji: "📡", text: "인터넷 빠름" },
  { emoji: "🛒", text: "쇼핑 편리" },
  { emoji: "🏠", text: "숙소 다양" },
];

export const CON_TAGS = [
  { emoji: "🚗", text: "차 필수" },
  { emoji: "✈️", text: "이동 비용 높음" },
  { emoji: "🌬️", text: "바람 강함" },
  { emoji: "🏘️", text: "단기 임대 비쌈" },
  { emoji: "🎭", text: "문화시설 부족" },
  { emoji: "🏥", text: "병원 적음" },
  { emoji: "🛒", text: "쇼핑 불편" },
  { emoji: "🌧️", text: "비 자주 옴" },
  { emoji: "🥶", text: "겨울 추움" },
  { emoji: "🥵", text: "여름 더움" },
  { emoji: "📡", text: "인터넷 느림" },
  { emoji: "🚆", text: "대중교통 불편" },
];

export const PROFESSIONS = [
  "개발자",
  "디자이너",
  "마케터",
  "기획자",
  "작가/크리에이터",
  "기타",
];

export const STAY_DURATIONS = [
  { value: "under1week", label: "1주 미만" },
  { value: "1to4weeks", label: "1~4주" },
  { value: "1to3months", label: "1~3개월" },
  { value: "over3months", label: "3개월 이상" },
];
