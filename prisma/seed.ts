import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Re-declare minimal types (avoid @/ alias issues in seed) ────────

type MetricKey =
  | "internet" | "cost" | "transport" | "coworking" | "safety" | "food"
  | "nature" | "culture" | "medical" | "amenities" | "community" | "housing";

const METRICS: { key: MetricKey; label: string; emoji: string }[] = [
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

// ─── City Data (all 30 cities) ───────────────────────────────────────

interface CityInput {
  slug: string;
  name: string;
  nameEn: string;
  region: string;
  category: string;
  description: string;
  overallScore: number;
  reviewCount: number;
  metricScores: Record<string, number>;
  rent: number;
  food: number;
  transport: number;
  cafe: number;
  utility: number;
  monthlyCost: number;
  internetSpeed: number;
  currentTemp: number;
  weatherIcon: string;
  hasKTX: boolean;
  isSeaside: boolean;
  highlights: string[];
  pros: { id: string; text: string; emoji: string; votes: number }[];
  cons: { id: string; text: string; emoji: string; votes: number }[];
  temps: number[];
  rain: number[];
  humidity: number[];
  nearbySlugs: string[];
}

const citiesData: CityInput[] = [
  {
    slug: "jeju", name: "제주", nameEn: "Jeju", region: "제주", category: "workation",
    description: "대한민국 대표 워케이션 도시. 아름다운 자연환경과 독특한 문화, 그리고 점점 늘어나는 코워킹 인프라가 디지털 노마드들을 끌어들이고 있습니다.",
    overallScore: 4.3, reviewCount: 156, monthlyCost: 130, internetSpeed: 95, currentTemp: 12, weatherIcon: "⛅", hasKTX: false, isSeaside: true,
    metricScores: { internet: 3.8, cost: 3.2, transport: 2.5, coworking: 3.5, safety: 4.5, food: 4.8, nature: 5.0, culture: 4.2, medical: 3.5, amenities: 3.8, community: 4.0, housing: 3.0 },
    rent: 55, food: 35, transport: 15, cafe: 15, utility: 10,
    highlights: ["🌊 바다뷰 카페", "🏄 서핑 명소", "🍊 감귤 천국"],
    pros: [
      { id: "p-jeju-1", text: "자연 좋음", emoji: "🌿", votes: 89 },
      { id: "p-jeju-2", text: "카페 많음", emoji: "☕", votes: 72 },
      { id: "p-jeju-3", text: "힐링/워라밸", emoji: "🧘", votes: 65 },
      { id: "p-jeju-4", text: "먹거리 다양", emoji: "🍜", votes: 58 },
      { id: "p-jeju-5", text: "모임 활발", emoji: "👥", votes: 41 },
    ],
    cons: [
      { id: "c-jeju-1", text: "차 필수", emoji: "🚗", votes: 95 },
      { id: "c-jeju-2", text: "이동 비용 높음", emoji: "✈️", votes: 68 },
      { id: "c-jeju-3", text: "바람 강함", emoji: "🌬️", votes: 52 },
      { id: "c-jeju-4", text: "단기 임대 비쌈", emoji: "🏘️", votes: 47 },
    ],
    temps: [-1, 1, 5, 11, 16, 20, 25, 27, 22, 16, 9, 3],
    rain: [60, 55, 85, 95, 90, 165, 210, 280, 195, 80, 75, 50],
    humidity: [65, 62, 63, 65, 68, 78, 82, 80, 75, 68, 65, 63],
    nearbySlugs: ["seogwipo", "busan", "yeosu"],
  },
  {
    slug: "gangneung", name: "강릉", nameEn: "Gangneung", region: "강원", category: "workation",
    description: "KTX로 서울에서 2시간. 바다와 커피의 도시로, 최근 디지털 노마드 인프라가 빠르게 성장하고 있습니다.",
    overallScore: 4.1, reviewCount: 98, monthlyCost: 95, internetSpeed: 85, currentTemp: 8, weatherIcon: "☀️", hasKTX: true, isSeaside: true,
    metricScores: { internet: 3.5, cost: 4.0, transport: 3.8, coworking: 3.0, safety: 4.3, food: 4.5, nature: 4.8, culture: 3.5, medical: 3.0, amenities: 3.2, community: 3.5, housing: 3.8 },
    rent: 35, food: 30, transport: 10, cafe: 12, utility: 8,
    highlights: ["☕ 카페 거리", "🏖️ 경포 해변", "🚆 KTX 2시간"],
    pros: [
      { id: "p-gang-1", text: "바다 근접", emoji: "🌊", votes: 76 },
      { id: "p-gang-2", text: "카페 많음", emoji: "☕", votes: 69 },
      { id: "p-gang-3", text: "교통 편리", emoji: "🚆", votes: 55 },
      { id: "p-gang-4", text: "물가 저렴", emoji: "💰", votes: 48 },
    ],
    cons: [
      { id: "c-gang-1", text: "겨울 추움", emoji: "🥶", votes: 62 },
      { id: "c-gang-2", text: "코워킹 좋음", emoji: "🏢", votes: 35 },
      { id: "c-gang-3", text: "문화시설 부족", emoji: "🎭", votes: 28 },
    ],
    temps: [-2, 0, 5, 12, 17, 21, 25, 26, 21, 14, 7, 1],
    rain: [40, 35, 45, 65, 80, 110, 190, 200, 150, 55, 45, 30],
    humidity: [55, 52, 53, 55, 62, 72, 78, 77, 70, 60, 57, 54],
    nearbySlugs: ["sokcho", "chuncheon", "wonju"],
  },
  {
    slug: "jeonju", name: "전주", nameEn: "Jeonju", region: "전라", category: "workation",
    description: "한옥마을과 비빔밥의 도시. 전통 문화와 현대적 감성이 조화를 이루며, 합리적인 생활비로 장기 체류에 적합합니다.",
    overallScore: 4.0, reviewCount: 72, monthlyCost: 85, internetSpeed: 90, currentTemp: 10, weatherIcon: "☀️", hasKTX: true, isSeaside: false,
    metricScores: { internet: 3.7, cost: 4.5, transport: 3.5, coworking: 3.2, safety: 4.2, food: 5.0, nature: 3.5, culture: 4.8, medical: 3.5, amenities: 3.5, community: 3.3, housing: 4.2 },
    rent: 30, food: 25, transport: 10, cafe: 12, utility: 8,
    highlights: ["🏛️ 한옥마을", "🍚 비빔밥 성지", "📚 문화 도시"],
    pros: [
      { id: "p-jj-1", text: "물가 저렴", emoji: "💰", votes: 65 },
      { id: "p-jj-2", text: "먹거리 다양", emoji: "🍜", votes: 82 },
      { id: "p-jj-3", text: "문화 풍부", emoji: "🏛️", votes: 58 },
      { id: "p-jj-4", text: "교통 편리", emoji: "🚆", votes: 42 },
    ],
    cons: [
      { id: "c-jj-1", text: "여름 더움", emoji: "🥵", votes: 38 },
      { id: "c-jj-2", text: "쇼핑 불편", emoji: "🛒", votes: 25 },
    ],
    temps: [-1, 2, 7, 14, 19, 23, 27, 27, 22, 15, 8, 2],
    rain: [30, 35, 50, 70, 85, 130, 250, 230, 120, 45, 40, 25],
    humidity: [62, 58, 58, 60, 65, 72, 80, 78, 72, 65, 63, 62],
    nearbySlugs: ["gunsan", "gwangju", "daejeon"],
  },
  {
    slug: "busan", name: "부산", nameEn: "Busan", region: "경상", category: "metropolis",
    description: "대한민국 제2의 도시. 해운대, 광안리 등 해변과 도시의 활기가 공존하며, 풍부한 인프라를 갖추고 있습니다.",
    overallScore: 4.2, reviewCount: 134, monthlyCost: 110, internetSpeed: 150, currentTemp: 13, weatherIcon: "☀️", hasKTX: true, isSeaside: true,
    metricScores: { internet: 4.5, cost: 3.5, transport: 4.2, coworking: 4.0, safety: 4.0, food: 4.8, nature: 4.5, culture: 4.0, medical: 4.2, amenities: 4.5, community: 4.2, housing: 3.5 },
    rent: 45, food: 30, transport: 12, cafe: 13, utility: 10,
    highlights: ["🏖️ 해운대", "🌉 광안대교", "🍲 돼지국밥"],
    pros: [
      { id: "p-bs-1", text: "바다 근접", emoji: "🌊", votes: 92 },
      { id: "p-bs-2", text: "먹거리 다양", emoji: "🍜", votes: 85 },
      { id: "p-bs-3", text: "교통 편리", emoji: "🚆", votes: 70 },
      { id: "p-bs-4", text: "인터넷 빠름", emoji: "📡", votes: 55 },
    ],
    cons: [
      { id: "c-bs-1", text: "여름 더움", emoji: "🥵", votes: 45 },
      { id: "c-bs-2", text: "단기 임대 비쌈", emoji: "🏘️", votes: 38 },
    ],
    temps: [3, 5, 9, 14, 19, 22, 26, 27, 23, 18, 11, 5],
    rain: [35, 40, 65, 95, 100, 180, 260, 200, 155, 55, 45, 25],
    humidity: [50, 52, 55, 58, 64, 75, 80, 78, 68, 58, 55, 50],
    nearbySlugs: ["ulsan", "gyeongju", "tongyeong"],
  },
  {
    slug: "seoul", name: "서울", nameEn: "Seoul", region: "서울/경기", category: "metropolis",
    description: "대한민국의 수도. 최고의 인프라와 문화, 하지만 높은 생활비. 디지털 노마드 커뮤니티가 가장 활발합니다.",
    overallScore: 3.8, reviewCount: 210, monthlyCost: 170, internetSpeed: 300, currentTemp: 9, weatherIcon: "⛅", hasKTX: true, isSeaside: false,
    metricScores: { internet: 5.0, cost: 2.0, transport: 5.0, coworking: 5.0, safety: 4.0, food: 4.5, nature: 2.5, culture: 5.0, medical: 5.0, amenities: 5.0, community: 5.0, housing: 2.0 },
    rent: 75, food: 40, transport: 15, cafe: 20, utility: 20,
    highlights: ["🏙️ 대도시", "📡 초고속 인터넷", "👥 활발한 커뮤니티"],
    pros: [
      { id: "p-se-1", text: "인터넷 빠름", emoji: "📡", votes: 120 },
      { id: "p-se-2", text: "코워킹 좋음", emoji: "🏢", votes: 98 },
      { id: "p-se-3", text: "모임 활발", emoji: "👥", votes: 88 },
      { id: "p-se-4", text: "교통 편리", emoji: "🚆", votes: 82 },
    ],
    cons: [
      { id: "c-se-1", text: "단기 임대 비쌈", emoji: "🏘️", votes: 130 },
      { id: "c-se-2", text: "이동 비용 높음", emoji: "✈️", votes: 42 },
    ],
    temps: [-3, 0, 5, 12, 18, 23, 26, 27, 22, 15, 7, 0],
    rain: [20, 25, 45, 65, 100, 130, 330, 280, 140, 50, 50, 20],
    humidity: [55, 52, 52, 52, 58, 68, 78, 78, 68, 60, 58, 55],
    nearbySlugs: ["pangyo", "suwon", "incheon", "goyang"],
  },
  {
    slug: "pangyo", name: "판교", nameEn: "Pangyo", region: "서울/경기", category: "satellite",
    description: "한국의 실리콘밸리. IT 기업 밀집 지역으로 스타트업 생태계가 활발하며, 서울 접근성도 좋습니다.",
    overallScore: 3.7, reviewCount: 45, monthlyCost: 155, internetSpeed: 250, currentTemp: 8, weatherIcon: "⛅", hasKTX: false, isSeaside: false,
    metricScores: { internet: 4.8, cost: 2.2, transport: 4.0, coworking: 4.5, safety: 4.5, food: 3.5, nature: 3.0, culture: 3.0, medical: 4.5, amenities: 4.5, community: 4.5, housing: 2.5 },
    rent: 70, food: 38, transport: 12, cafe: 18, utility: 17,
    highlights: ["💻 IT 허브", "🏢 코워킹 밀집", "🚇 서울 30분"],
    pros: [
      { id: "p-pg-1", text: "인터넷 빠름", emoji: "📡", votes: 35 },
      { id: "p-pg-2", text: "코워킹 좋음", emoji: "🏢", votes: 32 },
      { id: "p-pg-3", text: "모임 활발", emoji: "👥", votes: 28 },
    ],
    cons: [
      { id: "c-pg-1", text: "단기 임대 비쌈", emoji: "🏘️", votes: 30 },
      { id: "c-pg-2", text: "자연 좋음", emoji: "🌿", votes: 18 },
    ],
    temps: [-4, -1, 5, 12, 18, 23, 26, 27, 21, 14, 6, -1],
    rain: [22, 28, 48, 68, 105, 135, 340, 290, 145, 52, 48, 22],
    humidity: [58, 55, 55, 55, 60, 70, 80, 80, 70, 62, 60, 58],
    nearbySlugs: ["seoul", "suwon", "yongin"],
  },
  {
    slug: "suwon", name: "수원", nameEn: "Suwon", region: "서울/경기", category: "satellite",
    description: "수원 화성이 있는 역사 도시이자 삼성 반도체의 본거지. 서울보다 저렴한 생활비와 좋은 인프라를 갖추고 있습니다.",
    overallScore: 3.5, reviewCount: 38, monthlyCost: 120, internetSpeed: 200, currentTemp: 8, weatherIcon: "☀️", hasKTX: true, isSeaside: false,
    metricScores: { internet: 4.5, cost: 3.2, transport: 4.0, coworking: 3.5, safety: 4.2, food: 3.8, nature: 2.8, culture: 3.5, medical: 4.0, amenities: 4.0, community: 3.0, housing: 3.5 },
    rent: 50, food: 32, transport: 12, cafe: 14, utility: 12,
    highlights: ["🏯 수원 화성", "🏢 삼성타운", "🚆 KTX 연결"],
    pros: [
      { id: "p-sw-1", text: "교통 편리", emoji: "🚆", votes: 28 },
      { id: "p-sw-2", text: "인터넷 빠름", emoji: "📡", votes: 22 },
    ],
    cons: [
      { id: "c-sw-1", text: "문화시설 부족", emoji: "🎭", votes: 20 },
    ],
    temps: [-4, -1, 5, 12, 18, 23, 26, 27, 21, 14, 6, -1],
    rain: [22, 28, 48, 68, 105, 135, 340, 290, 145, 52, 48, 22],
    humidity: [58, 55, 55, 55, 60, 70, 80, 80, 70, 62, 60, 58],
    nearbySlugs: ["seoul", "pangyo", "yongin"],
  },
  {
    slug: "incheon", name: "인천", nameEn: "Incheon", region: "서울/경기", category: "metropolis",
    description: "국제공항이 있는 항구 도시. 서울 접근성이 좋고 차이나타운, 월미도 등 독특한 매력을 가지고 있습니다.",
    overallScore: 3.4, reviewCount: 42, monthlyCost: 115, internetSpeed: 180, currentTemp: 8, weatherIcon: "⛅", hasKTX: true, isSeaside: true,
    metricScores: { internet: 4.2, cost: 3.3, transport: 4.5, coworking: 3.0, safety: 3.8, food: 4.0, nature: 3.5, culture: 3.5, medical: 4.0, amenities: 4.0, community: 2.8, housing: 3.5 },
    rent: 45, food: 32, transport: 15, cafe: 13, utility: 10,
    highlights: ["✈️ 국제공항", "🌊 월미도", "🥟 차이나타운"],
    pros: [
      { id: "p-ic-1", text: "교통 편리", emoji: "🚆", votes: 35 },
      { id: "p-ic-2", text: "바다 근접", emoji: "🌊", votes: 25 },
    ],
    cons: [
      { id: "c-ic-1", text: "문화시설 부족", emoji: "🎭", votes: 22 },
    ],
    temps: [-3, 0, 5, 11, 17, 22, 25, 27, 22, 15, 7, 0],
    rain: [20, 25, 40, 60, 95, 125, 320, 275, 135, 48, 45, 18],
    humidity: [60, 57, 57, 57, 63, 73, 82, 82, 73, 65, 63, 60],
    nearbySlugs: ["seoul", "goyang", "paju"],
  },
  {
    slug: "goyang", name: "고양", nameEn: "Goyang", region: "서울/경기", category: "satellite",
    description: "일산 호수공원과 킨텍스가 있는 도시. 서울 접근성 좋고 자연환경도 괜찮습니다.",
    overallScore: 3.3, reviewCount: 25, monthlyCost: 125, internetSpeed: 200, currentTemp: 7, weatherIcon: "☀️", hasKTX: false, isSeaside: false,
    metricScores: { internet: 4.3, cost: 3.0, transport: 3.8, coworking: 3.0, safety: 4.2, food: 3.5, nature: 3.5, culture: 3.0, medical: 4.0, amenities: 4.0, community: 2.5, housing: 3.2 },
    rent: 52, food: 33, transport: 13, cafe: 15, utility: 12,
    highlights: ["🌳 호수공원", "🏛️ 킨텍스", "🚇 서울 40분"],
    pros: [
      { id: "p-gy-1", text: "자연 좋음", emoji: "🌿", votes: 18 },
      { id: "p-gy-2", text: "교통 편리", emoji: "🚆", votes: 15 },
    ],
    cons: [
      { id: "c-gy-1", text: "문화시설 부족", emoji: "🎭", votes: 15 },
    ],
    temps: [-5, -2, 4, 11, 17, 22, 26, 27, 21, 13, 5, -2],
    rain: [18, 22, 42, 62, 98, 128, 330, 280, 138, 48, 42, 18],
    humidity: [58, 55, 55, 55, 60, 70, 80, 80, 70, 62, 60, 58],
    nearbySlugs: ["seoul", "paju", "incheon"],
  },
  {
    slug: "yongin", name: "용인", nameEn: "Yongin", region: "서울/경기", category: "satellite",
    description: "에버랜드가 있는 도시. 판교와 가까워 IT 종사자들이 많이 거주합니다.",
    overallScore: 3.2, reviewCount: 20, monthlyCost: 130, internetSpeed: 180, currentTemp: 8, weatherIcon: "☀️", hasKTX: false, isSeaside: false,
    metricScores: { internet: 4.2, cost: 2.8, transport: 3.2, coworking: 2.8, safety: 4.3, food: 3.2, nature: 3.5, culture: 2.8, medical: 3.8, amenities: 3.8, community: 2.5, housing: 3.0 },
    rent: 55, food: 34, transport: 14, cafe: 15, utility: 12,
    highlights: ["🎢 에버랜드", "💻 판교 근접", "🌳 자연환경"],
    pros: [
      { id: "p-yi-1", text: "안전", emoji: "👌", votes: 15 },
    ],
    cons: [
      { id: "c-yi-1", text: "대중교통 불편", emoji: "🚆", votes: 18 },
    ],
    temps: [-5, -2, 4, 12, 18, 23, 26, 27, 21, 14, 5, -2],
    rain: [22, 28, 48, 68, 105, 135, 340, 290, 145, 52, 48, 22],
    humidity: [58, 55, 55, 55, 60, 70, 80, 80, 70, 62, 60, 58],
    nearbySlugs: ["pangyo", "suwon", "seoul"],
  },
  {
    slug: "paju", name: "파주", nameEn: "Paju", region: "서울/경기", category: "satellite",
    description: "프로방스마을, 헤이리 예술마을 등 문화 공간이 많은 도시. DMZ 근처의 독특한 분위기.",
    overallScore: 3.1, reviewCount: 18, monthlyCost: 100, internetSpeed: 120, currentTemp: 6, weatherIcon: "☀️", hasKTX: false, isSeaside: false,
    metricScores: { internet: 3.5, cost: 3.8, transport: 2.8, coworking: 2.5, safety: 4.0, food: 3.0, nature: 4.0, culture: 3.8, medical: 3.0, amenities: 3.0, community: 2.0, housing: 3.5 },
    rent: 38, food: 28, transport: 12, cafe: 12, utility: 10,
    highlights: ["🎨 헤이리마을", "📚 출판도시", "🏞️ DMZ 근접"],
    pros: [
      { id: "p-pj-1", text: "물가 저렴", emoji: "💰", votes: 12 },
      { id: "p-pj-2", text: "자연 좋음", emoji: "🌿", votes: 10 },
    ],
    cons: [
      { id: "c-pj-1", text: "대중교통 불편", emoji: "🚆", votes: 15 },
      { id: "c-pj-2", text: "인터넷 느림", emoji: "📡", votes: 8 },
    ],
    temps: [-6, -3, 3, 10, 16, 21, 25, 26, 20, 13, 5, -3],
    rain: [18, 22, 40, 60, 95, 125, 320, 270, 130, 45, 40, 15],
    humidity: [60, 57, 57, 57, 62, 72, 82, 82, 72, 64, 62, 60],
    nearbySlugs: ["goyang", "seoul", "incheon"],
  },
  {
    slug: "sokcho", name: "속초", nameEn: "Sokcho", region: "강원", category: "workation",
    description: "설악산과 동해바다를 모두 즐길 수 있는 소도시. 자연 속에서 작업하고 싶은 노마드에게 추천.",
    overallScore: 3.9, reviewCount: 55, monthlyCost: 90, internetSpeed: 75, currentTemp: 6, weatherIcon: "☀️", hasKTX: false, isSeaside: true,
    metricScores: { internet: 3.0, cost: 4.2, transport: 2.5, coworking: 2.5, safety: 4.5, food: 4.2, nature: 5.0, culture: 3.0, medical: 2.8, amenities: 3.0, community: 2.8, housing: 3.5 },
    rent: 32, food: 28, transport: 10, cafe: 12, utility: 8,
    highlights: ["🏔️ 설악산", "🌊 동해바다", "🦑 속초 명물"],
    pros: [
      { id: "p-sc-1", text: "자연 좋음", emoji: "🌿", votes: 45 },
      { id: "p-sc-2", text: "물가 저렴", emoji: "💰", votes: 38 },
      { id: "p-sc-3", text: "바다 근접", emoji: "🌊", votes: 35 },
    ],
    cons: [
      { id: "c-sc-1", text: "대중교통 불편", emoji: "🚆", votes: 40 },
      { id: "c-sc-2", text: "인터넷 느림", emoji: "📡", votes: 28 },
      { id: "c-sc-3", text: "겨울 추움", emoji: "🥶", votes: 25 },
    ],
    temps: [-3, -1, 4, 10, 15, 20, 24, 25, 20, 14, 6, 0],
    rain: [35, 30, 40, 55, 70, 100, 170, 185, 140, 50, 42, 28],
    humidity: [52, 50, 52, 55, 62, 72, 78, 78, 70, 60, 55, 52],
    nearbySlugs: ["gangneung", "chuncheon"],
  },
  {
    slug: "chuncheon", name: "춘천", nameEn: "Chuncheon", region: "강원", category: "smalltown",
    description: "닭갈비와 호수의 도시. 서울에서 ITX로 1시간. 자연이 풍부하고 물가가 저렴합니다.",
    overallScore: 3.5, reviewCount: 35, monthlyCost: 85, internetSpeed: 100, currentTemp: 6, weatherIcon: "☀️", hasKTX: false, isSeaside: false,
    metricScores: { internet: 3.5, cost: 4.3, transport: 3.5, coworking: 2.8, safety: 4.3, food: 4.0, nature: 4.5, culture: 3.0, medical: 3.2, amenities: 3.2, community: 2.5, housing: 4.0 },
    rent: 30, food: 25, transport: 10, cafe: 12, utility: 8,
    highlights: ["🍗 닭갈비", "🏞️ 의암호", "🚇 ITX 1시간"],
    pros: [
      { id: "p-cc-1", text: "물가 저렴", emoji: "💰", votes: 25 },
      { id: "p-cc-2", text: "자연 좋음", emoji: "🌿", votes: 22 },
    ],
    cons: [
      { id: "c-cc-1", text: "겨울 추움", emoji: "🥶", votes: 28 },
      { id: "c-cc-2", text: "문화시설 부족", emoji: "🎭", votes: 18 },
    ],
    temps: [-6, -3, 3, 10, 16, 21, 25, 25, 19, 12, 4, -3],
    rain: [22, 25, 42, 65, 85, 115, 280, 260, 150, 48, 42, 18],
    humidity: [58, 55, 53, 55, 60, 70, 80, 80, 72, 62, 60, 58],
    nearbySlugs: ["gangneung", "sokcho", "wonju"],
  },
  {
    slug: "wonju", name: "원주", nameEn: "Wonju", region: "강원", category: "smalltown",
    description: "KTX 연결이 좋은 강원도의 관문 도시. 혁신도시로 인프라가 빠르게 성장 중입니다.",
    overallScore: 3.3, reviewCount: 22, monthlyCost: 88, internetSpeed: 110, currentTemp: 7, weatherIcon: "☀️", hasKTX: true, isSeaside: false,
    metricScores: { internet: 3.8, cost: 4.2, transport: 3.8, coworking: 2.8, safety: 4.2, food: 3.5, nature: 4.0, culture: 2.8, medical: 3.5, amenities: 3.5, community: 2.2, housing: 3.8 },
    rent: 32, food: 26, transport: 10, cafe: 12, utility: 8,
    highlights: ["🚆 KTX 연결", "🏥 의료도시", "🌿 치악산"],
    pros: [
      { id: "p-wj-1", text: "물가 저렴", emoji: "💰", votes: 15 },
      { id: "p-wj-2", text: "교통 편리", emoji: "🚆", votes: 12 },
    ],
    cons: [
      { id: "c-wj-1", text: "문화시설 부족", emoji: "🎭", votes: 15 },
    ],
    temps: [-5, -2, 4, 11, 17, 22, 25, 25, 20, 13, 5, -2],
    rain: [25, 28, 45, 68, 90, 120, 290, 270, 155, 50, 45, 20],
    humidity: [60, 57, 55, 57, 62, 72, 82, 82, 74, 64, 62, 60],
    nearbySlugs: ["chuncheon", "gangneung", "cheongju"],
  },
  {
    slug: "daejeon", name: "대전", nameEn: "Daejeon", region: "충청", category: "metropolis",
    description: "과학의 도시. KAIST, 대덕연구단지가 있어 IT/R&D 종사자들이 많습니다. KTX로 서울 1시간.",
    overallScore: 3.6, reviewCount: 48, monthlyCost: 100, internetSpeed: 200, currentTemp: 9, weatherIcon: "☀️", hasKTX: true, isSeaside: false,
    metricScores: { internet: 4.5, cost: 3.8, transport: 4.2, coworking: 3.5, safety: 4.2, food: 3.5, nature: 3.0, culture: 3.2, medical: 4.0, amenities: 4.0, community: 3.5, housing: 3.8 },
    rent: 38, food: 28, transport: 10, cafe: 14, utility: 10,
    highlights: ["🔬 과학도시", "🚆 KTX 1시간", "🏫 KAIST"],
    pros: [
      { id: "p-dj-1", text: "교통 편리", emoji: "🚆", votes: 38 },
      { id: "p-dj-2", text: "인터넷 빠름", emoji: "📡", votes: 30 },
    ],
    cons: [
      { id: "c-dj-1", text: "문화시설 부족", emoji: "🎭", votes: 25 },
    ],
    temps: [-3, 0, 5, 13, 18, 23, 26, 27, 21, 14, 7, 0],
    rain: [25, 28, 48, 65, 90, 130, 280, 250, 130, 45, 42, 20],
    humidity: [60, 57, 55, 55, 60, 68, 78, 78, 70, 62, 60, 60],
    nearbySlugs: ["sejong", "cheongju", "cheonan"],
  },
  {
    slug: "sejong", name: "세종", nameEn: "Sejong", region: "충청", category: "metropolis",
    description: "행정수도. 신도시라 깨끗하고 인프라가 잘 갖춰져 있습니다. 다만 아직 문화 인프라는 부족.",
    overallScore: 3.4, reviewCount: 28, monthlyCost: 105, internetSpeed: 200, currentTemp: 8, weatherIcon: "☀️", hasKTX: false, isSeaside: false,
    metricScores: { internet: 4.5, cost: 3.5, transport: 3.0, coworking: 3.2, safety: 4.5, food: 3.0, nature: 3.5, culture: 2.5, medical: 4.0, amenities: 4.2, community: 2.5, housing: 4.0 },
    rent: 42, food: 28, transport: 12, cafe: 13, utility: 10,
    highlights: ["🏛️ 행정수도", "🏗️ 신도시", "🌳 세종호수공원"],
    pros: [
      { id: "p-sj-1", text: "인터넷 빠름", emoji: "📡", votes: 20 },
      { id: "p-sj-2", text: "숙소 다양", emoji: "🏠", votes: 15 },
    ],
    cons: [
      { id: "c-sj-1", text: "문화시설 부족", emoji: "🎭", votes: 22 },
      { id: "c-sj-2", text: "대중교통 불편", emoji: "🚆", votes: 18 },
    ],
    temps: [-3, 0, 5, 13, 18, 23, 26, 27, 21, 14, 7, 0],
    rain: [25, 28, 48, 65, 90, 130, 280, 250, 130, 45, 42, 20],
    humidity: [60, 57, 55, 55, 60, 68, 78, 78, 70, 62, 60, 60],
    nearbySlugs: ["daejeon", "cheongju", "cheonan"],
  },
  {
    slug: "cheongju", name: "청주", nameEn: "Cheongju", region: "충청", category: "smalltown",
    description: "충북의 중심. 공항이 있어 접근성이 좋고, 물가가 저렴하여 장기 체류에 유리합니다.",
    overallScore: 3.3, reviewCount: 22, monthlyCost: 85, internetSpeed: 120, currentTemp: 8, weatherIcon: "☀️", hasKTX: false, isSeaside: false,
    metricScores: { internet: 3.8, cost: 4.3, transport: 3.2, coworking: 2.5, safety: 4.2, food: 3.5, nature: 3.2, culture: 3.0, medical: 3.5, amenities: 3.5, community: 2.2, housing: 4.0 },
    rent: 30, food: 25, transport: 10, cafe: 12, utility: 8,
    highlights: ["✈️ 청주공항", "💰 저렴한 물가", "🏞️ 수암골"],
    pros: [
      { id: "p-cj-1", text: "물가 저렴", emoji: "💰", votes: 18 },
    ],
    cons: [
      { id: "c-cj-1", text: "문화시설 부족", emoji: "🎭", votes: 15 },
    ],
    temps: [-3, 0, 5, 13, 18, 23, 26, 27, 21, 14, 7, 0],
    rain: [25, 28, 48, 65, 90, 130, 280, 250, 130, 45, 42, 20],
    humidity: [60, 57, 55, 55, 60, 68, 78, 78, 70, 62, 60, 60],
    nearbySlugs: ["daejeon", "sejong", "wonju"],
  },
  {
    slug: "cheonan", name: "천안", nameEn: "Cheonan", region: "충청", category: "smalltown",
    description: "KTX로 서울 40분. 수도권과 가까우면서도 저렴한 생활비가 매력입니다.",
    overallScore: 3.2, reviewCount: 18, monthlyCost: 90, internetSpeed: 150, currentTemp: 8, weatherIcon: "☀️", hasKTX: true, isSeaside: false,
    metricScores: { internet: 4.0, cost: 4.2, transport: 4.0, coworking: 2.5, safety: 4.0, food: 3.3, nature: 2.8, culture: 2.8, medical: 3.5, amenities: 3.5, community: 2.0, housing: 4.0 },
    rent: 32, food: 26, transport: 10, cafe: 12, utility: 10,
    highlights: ["🚆 KTX 40분", "💰 저렴한 물가", "🍇 포도"],
    pros: [
      { id: "p-ca-1", text: "교통 편리", emoji: "🚆", votes: 14 },
      { id: "p-ca-2", text: "물가 저렴", emoji: "💰", votes: 12 },
    ],
    cons: [
      { id: "c-ca-1", text: "문화시설 부족", emoji: "🎭", votes: 14 },
    ],
    temps: [-3, 0, 5, 13, 18, 23, 26, 27, 21, 14, 7, 0],
    rain: [25, 28, 48, 65, 90, 130, 280, 250, 130, 45, 42, 20],
    humidity: [60, 57, 55, 55, 60, 68, 78, 78, 70, 62, 60, 60],
    nearbySlugs: ["daejeon", "sejong", "suwon"],
  },
  {
    slug: "gwangju", name: "광주", nameEn: "Gwangju", region: "전라", category: "metropolis",
    description: "예술과 민주주의의 도시. 풍부한 문화 인프라와 맛의 고장으로 유명합니다.",
    overallScore: 3.7, reviewCount: 52, monthlyCost: 90, internetSpeed: 150, currentTemp: 11, weatherIcon: "☀️", hasKTX: true, isSeaside: false,
    metricScores: { internet: 4.0, cost: 4.2, transport: 3.5, coworking: 3.0, safety: 4.0, food: 4.8, nature: 3.2, culture: 4.5, medical: 4.0, amenities: 3.8, community: 3.2, housing: 4.0 },
    rent: 32, food: 26, transport: 10, cafe: 12, utility: 10,
    highlights: ["🎨 예술도시", "🍽️ 맛의 고장", "📚 문화 인프라"],
    pros: [
      { id: "p-gj-1", text: "먹거리 다양", emoji: "🍜", votes: 42 },
      { id: "p-gj-2", text: "물가 저렴", emoji: "💰", votes: 35 },
      { id: "p-gj-3", text: "문화 풍부", emoji: "🏛️", votes: 30 },
    ],
    cons: [
      { id: "c-gj-1", text: "여름 더움", emoji: "🥵", votes: 25 },
    ],
    temps: [0, 2, 7, 14, 19, 23, 27, 27, 22, 15, 8, 2],
    rain: [30, 35, 55, 75, 90, 140, 260, 240, 125, 48, 42, 22],
    humidity: [62, 58, 58, 60, 65, 72, 80, 78, 72, 65, 63, 62],
    nearbySlugs: ["jeonju", "mokpo", "suncheon"],
  },
  {
    slug: "yeosu", name: "여수", nameEn: "Yeosu", region: "전라", category: "workation",
    description: "여수 밤바다와 엑스포. 아름다운 해안 경관과 해산물이 매력적인 남해안 도시.",
    overallScore: 3.8, reviewCount: 48, monthlyCost: 95, internetSpeed: 80, currentTemp: 13, weatherIcon: "☀️", hasKTX: true, isSeaside: true,
    metricScores: { internet: 3.2, cost: 4.0, transport: 3.5, coworking: 2.5, safety: 4.2, food: 4.5, nature: 4.8, culture: 3.5, medical: 3.2, amenities: 3.0, community: 2.8, housing: 3.5 },
    rent: 35, food: 28, transport: 10, cafe: 12, utility: 10,
    highlights: ["🌃 밤바다", "🐟 해산물", "🚆 KTX 연결"],
    pros: [
      { id: "p-ys-1", text: "바다 근접", emoji: "🌊", votes: 38 },
      { id: "p-ys-2", text: "먹거리 다양", emoji: "🍜", votes: 35 },
      { id: "p-ys-3", text: "자연 좋음", emoji: "🌿", votes: 28 },
    ],
    cons: [
      { id: "c-ys-1", text: "대중교통 불편", emoji: "🚆", votes: 22 },
      { id: "c-ys-2", text: "인터넷 느림", emoji: "📡", votes: 18 },
    ],
    temps: [2, 4, 8, 13, 18, 21, 26, 27, 22, 17, 10, 4],
    rain: [35, 40, 60, 85, 95, 170, 240, 210, 150, 55, 45, 25],
    humidity: [58, 55, 58, 62, 68, 78, 82, 80, 74, 65, 60, 58],
    nearbySlugs: ["suncheon", "gwangju", "tongyeong"],
  },
  {
    slug: "mokpo", name: "목포", nameEn: "Mokpo", region: "전라", category: "smalltown",
    description: "서남해안의 항구도시. 유달산, 갓바위 등 자연경관과 신안 섬여행의 관문.",
    overallScore: 3.2, reviewCount: 18, monthlyCost: 80, internetSpeed: 75, currentTemp: 12, weatherIcon: "☀️", hasKTX: true, isSeaside: true,
    metricScores: { internet: 3.0, cost: 4.5, transport: 3.5, coworking: 2.0, safety: 4.0, food: 4.5, nature: 4.2, culture: 3.5, medical: 3.0, amenities: 2.8, community: 2.0, housing: 4.0 },
    rent: 25, food: 22, transport: 10, cafe: 13, utility: 10,
    highlights: ["⛵ 섬여행 관문", "🐙 낙지 맛집", "🏔️ 유달산"],
    pros: [
      { id: "p-mp-1", text: "물가 저렴", emoji: "💰", votes: 15 },
      { id: "p-mp-2", text: "먹거리 다양", emoji: "🍜", votes: 12 },
    ],
    cons: [
      { id: "c-mp-1", text: "인터넷 느림", emoji: "📡", votes: 12 },
      { id: "c-mp-2", text: "쇼핑 불편", emoji: "🛒", votes: 10 },
    ],
    temps: [1, 3, 7, 13, 18, 22, 26, 27, 22, 16, 10, 3],
    rain: [30, 35, 55, 70, 85, 150, 230, 210, 130, 45, 40, 20],
    humidity: [65, 62, 62, 65, 70, 78, 82, 80, 75, 68, 65, 65],
    nearbySlugs: ["gwangju", "jeonju", "suncheon"],
  },
  {
    slug: "suncheon", name: "순천", nameEn: "Suncheon", region: "전라", category: "smalltown",
    description: "순천만 습지와 순천만국가정원이 있는 생태도시. 자연과 힐링을 원하는 노마드에게 추천.",
    overallScore: 3.5, reviewCount: 25, monthlyCost: 82, internetSpeed: 80, currentTemp: 11, weatherIcon: "☀️", hasKTX: true, isSeaside: false,
    metricScores: { internet: 3.2, cost: 4.5, transport: 3.2, coworking: 2.2, safety: 4.5, food: 4.0, nature: 5.0, culture: 3.5, medical: 3.2, amenities: 3.0, community: 2.2, housing: 4.0 },
    rent: 25, food: 24, transport: 10, cafe: 13, utility: 10,
    highlights: ["🌾 순천만습지", "🌺 국가정원", "🌿 생태도시"],
    pros: [
      { id: "p-sc2-1", text: "자연 좋음", emoji: "🌿", votes: 22 },
      { id: "p-sc2-2", text: "물가 저렴", emoji: "💰", votes: 18 },
    ],
    cons: [
      { id: "c-sc2-1", text: "인터넷 느림", emoji: "📡", votes: 15 },
    ],
    temps: [0, 2, 7, 13, 18, 22, 26, 27, 22, 15, 9, 2],
    rain: [32, 38, 58, 78, 92, 155, 245, 225, 135, 48, 42, 22],
    humidity: [62, 58, 58, 62, 68, 76, 82, 80, 74, 65, 62, 62],
    nearbySlugs: ["yeosu", "gwangju", "mokpo"],
  },
  {
    slug: "gunsan", name: "군산", nameEn: "Gunsan", region: "전라", category: "smalltown",
    description: "일제강점기 근대문화유산과 새만금이 있는 도시. 전주와 가까워 투도시 생활이 가능.",
    overallScore: 3.1, reviewCount: 15, monthlyCost: 78, internetSpeed: 75, currentTemp: 10, weatherIcon: "☀️", hasKTX: false, isSeaside: true,
    metricScores: { internet: 3.0, cost: 4.8, transport: 2.8, coworking: 2.0, safety: 4.0, food: 4.2, nature: 3.5, culture: 4.0, medical: 2.8, amenities: 2.8, community: 2.0, housing: 4.2 },
    rent: 22, food: 22, transport: 10, cafe: 14, utility: 10,
    highlights: ["🏚️ 근대문화", "🦀 간장게장", "🌅 새만금"],
    pros: [
      { id: "p-gs-1", text: "물가 저렴", emoji: "💰", votes: 12 },
      { id: "p-gs-2", text: "먹거리 다양", emoji: "🍜", votes: 10 },
    ],
    cons: [
      { id: "c-gs-1", text: "대중교통 불편", emoji: "🚆", votes: 12 },
      { id: "c-gs-2", text: "인터넷 느림", emoji: "📡", votes: 8 },
    ],
    temps: [-1, 1, 6, 13, 18, 22, 26, 27, 22, 15, 8, 1],
    rain: [28, 32, 50, 68, 85, 135, 245, 225, 120, 42, 38, 20],
    humidity: [62, 58, 58, 60, 65, 72, 80, 78, 72, 65, 63, 62],
    nearbySlugs: ["jeonju", "mokpo", "gwangju"],
  },
  {
    slug: "daegu", name: "대구", nameEn: "Daegu", region: "경상", category: "metropolis",
    description: "패션과 IT의 도시. 여름은 덥지만 KTX 접근성이 좋고, 코워킹 인프라가 발전 중입니다.",
    overallScore: 3.5, reviewCount: 55, monthlyCost: 95, internetSpeed: 180, currentTemp: 11, weatherIcon: "☀️", hasKTX: true, isSeaside: false,
    metricScores: { internet: 4.2, cost: 4.0, transport: 4.0, coworking: 3.2, safety: 3.8, food: 4.0, nature: 2.8, culture: 3.5, medical: 4.0, amenities: 4.0, community: 3.0, housing: 3.8 },
    rent: 35, food: 27, transport: 10, cafe: 13, utility: 10,
    highlights: ["🚆 KTX 허브", "👗 패션도시", "🍜 막창/납작만두"],
    pros: [
      { id: "p-dg-1", text: "물가 저렴", emoji: "💰", votes: 35 },
      { id: "p-dg-2", text: "교통 편리", emoji: "🚆", votes: 30 },
    ],
    cons: [
      { id: "c-dg-1", text: "여름 더움", emoji: "🥵", votes: 45 },
    ],
    temps: [0, 3, 8, 15, 20, 24, 28, 28, 23, 16, 9, 2],
    rain: [22, 28, 48, 65, 80, 120, 230, 200, 120, 40, 35, 18],
    humidity: [50, 48, 48, 50, 55, 65, 75, 75, 65, 55, 52, 50],
    nearbySlugs: ["gyeongju", "pohang", "busan"],
  },
  {
    slug: "ulsan", name: "울산", nameEn: "Ulsan", region: "경상", category: "metropolis",
    description: "산업도시이지만 대왕암 공원, 간절곶 등 자연 명소와 고래문화특구가 매력적입니다.",
    overallScore: 3.3, reviewCount: 28, monthlyCost: 95, internetSpeed: 150, currentTemp: 12, weatherIcon: "☀️", hasKTX: true, isSeaside: true,
    metricScores: { internet: 4.0, cost: 4.0, transport: 3.2, coworking: 2.5, safety: 4.0, food: 3.8, nature: 4.0, culture: 3.0, medical: 3.5, amenities: 3.5, community: 2.2, housing: 3.8 },
    rent: 35, food: 27, transport: 10, cafe: 13, utility: 10,
    highlights: ["🐋 고래문화", "🌅 간절곶", "🏭 산업도시"],
    pros: [
      { id: "p-us-1", text: "물가 저렴", emoji: "💰", votes: 18 },
      { id: "p-us-2", text: "바다 근접", emoji: "🌊", votes: 15 },
    ],
    cons: [
      { id: "c-us-1", text: "문화시설 부족", emoji: "🎭", votes: 18 },
    ],
    temps: [2, 4, 8, 14, 18, 22, 26, 27, 22, 17, 10, 4],
    rain: [30, 35, 55, 80, 95, 155, 230, 200, 145, 48, 40, 22],
    humidity: [48, 48, 50, 55, 62, 72, 78, 78, 68, 58, 52, 48],
    nearbySlugs: ["busan", "gyeongju", "pohang"],
  },
  {
    slug: "pohang", name: "포항", nameEn: "Pohang", region: "경상", category: "smalltown",
    description: "호미곶과 과메기의 도시. 동해안 일출 명소와 POSTECH이 있는 교육 도시.",
    overallScore: 3.2, reviewCount: 20, monthlyCost: 85, internetSpeed: 100, currentTemp: 11, weatherIcon: "☀️", hasKTX: true, isSeaside: true,
    metricScores: { internet: 3.5, cost: 4.2, transport: 3.2, coworking: 2.2, safety: 4.0, food: 4.2, nature: 4.2, culture: 3.0, medical: 3.2, amenities: 3.0, community: 2.0, housing: 3.8 },
    rent: 28, food: 25, transport: 10, cafe: 12, utility: 10,
    highlights: ["🌅 호미곶", "🐟 과메기", "🏫 POSTECH"],
    pros: [
      { id: "p-ph-1", text: "물가 저렴", emoji: "💰", votes: 15 },
      { id: "p-ph-2", text: "바다 근접", emoji: "🌊", votes: 12 },
    ],
    cons: [
      { id: "c-ph-1", text: "문화시설 부족", emoji: "🎭", votes: 12 },
    ],
    temps: [1, 3, 7, 13, 18, 21, 25, 26, 22, 16, 10, 3],
    rain: [28, 32, 50, 70, 85, 130, 200, 180, 135, 42, 38, 20],
    humidity: [48, 48, 50, 55, 62, 72, 78, 78, 68, 58, 52, 48],
    nearbySlugs: ["gyeongju", "ulsan", "daegu"],
  },
  {
    slug: "gyeongju", name: "경주", nameEn: "Gyeongju", region: "경상", category: "workation",
    description: "천년 고도. 역사 유적이 도시 곳곳에 있으며 최근 카페/게스트하우스 인프라가 성장 중.",
    overallScore: 3.6, reviewCount: 38, monthlyCost: 85, internetSpeed: 80, currentTemp: 11, weatherIcon: "☀️", hasKTX: true, isSeaside: true,
    metricScores: { internet: 3.2, cost: 4.3, transport: 3.5, coworking: 2.5, safety: 4.5, food: 4.0, nature: 4.5, culture: 5.0, medical: 3.0, amenities: 3.0, community: 2.8, housing: 3.8 },
    rent: 28, food: 25, transport: 10, cafe: 12, utility: 10,
    highlights: ["🏛️ 천년고도", "🌸 벚꽃", "☕ 황리단길"],
    pros: [
      { id: "p-gj2-1", text: "문화 풍부", emoji: "🏛️", votes: 32 },
      { id: "p-gj2-2", text: "물가 저렴", emoji: "💰", votes: 25 },
      { id: "p-gj2-3", text: "자연 좋음", emoji: "🌿", votes: 22 },
    ],
    cons: [
      { id: "c-gj2-1", text: "인터넷 느림", emoji: "📡", votes: 20 },
      { id: "c-gj2-2", text: "대중교통 불편", emoji: "🚆", votes: 15 },
    ],
    temps: [1, 3, 7, 13, 18, 22, 26, 27, 22, 16, 9, 3],
    rain: [25, 30, 48, 68, 82, 125, 210, 190, 130, 42, 35, 18],
    humidity: [50, 48, 50, 55, 62, 72, 78, 78, 68, 58, 52, 50],
    nearbySlugs: ["busan", "ulsan", "pohang"],
  },
  {
    slug: "tongyeong", name: "통영", nameEn: "Tongyeong", region: "경상", category: "workation",
    description: "동양의 나폴리. 한려수도의 아름다운 섬과 바다, 신선한 해산물이 매력인 남해안 보석.",
    overallScore: 3.7, reviewCount: 32, monthlyCost: 85, internetSpeed: 70, currentTemp: 12, weatherIcon: "☀️", hasKTX: false, isSeaside: true,
    metricScores: { internet: 2.8, cost: 4.3, transport: 2.5, coworking: 2.0, safety: 4.2, food: 4.8, nature: 5.0, culture: 4.0, medical: 2.8, amenities: 2.8, community: 2.5, housing: 3.5 },
    rent: 28, food: 25, transport: 10, cafe: 12, utility: 10,
    highlights: ["🏝️ 한려수도", "🐟 해산물천국", "🎵 윤이상"],
    pros: [
      { id: "p-ty-1", text: "자연 좋음", emoji: "🌿", votes: 28 },
      { id: "p-ty-2", text: "먹거리 다양", emoji: "🍜", votes: 25 },
      { id: "p-ty-3", text: "물가 저렴", emoji: "💰", votes: 20 },
    ],
    cons: [
      { id: "c-ty-1", text: "대중교통 불편", emoji: "🚆", votes: 22 },
      { id: "c-ty-2", text: "인터넷 느림", emoji: "📡", votes: 18 },
    ],
    temps: [3, 5, 9, 14, 18, 22, 26, 27, 23, 17, 11, 5],
    rain: [35, 40, 60, 85, 95, 170, 240, 210, 150, 55, 45, 25],
    humidity: [55, 52, 55, 60, 65, 75, 80, 78, 72, 62, 58, 55],
    nearbySlugs: ["busan", "yeosu", "gyeongju"],
  },
  {
    slug: "andong", name: "안동", nameEn: "Andong", region: "경상", category: "smalltown",
    description: "한국 정신문화의 수도. 하회마을, 안동찜닭 등 전통문화 체험과 저렴한 생활비가 장점.",
    overallScore: 3.1, reviewCount: 15, monthlyCost: 75, internetSpeed: 65, currentTemp: 9, weatherIcon: "☀️", hasKTX: false, isSeaside: false,
    metricScores: { internet: 2.5, cost: 4.8, transport: 2.2, coworking: 1.8, safety: 4.5, food: 4.0, nature: 4.2, culture: 4.8, medical: 2.5, amenities: 2.5, community: 2.0, housing: 4.2 },
    rent: 22, food: 22, transport: 8, cafe: 13, utility: 10,
    highlights: ["🏛️ 하회마을", "🍗 안동찜닭", "📜 정신문화"],
    pros: [
      { id: "p-ad-1", text: "물가 저렴", emoji: "💰", votes: 12 },
      { id: "p-ad-2", text: "문화 풍부", emoji: "🏛️", votes: 10 },
    ],
    cons: [
      { id: "c-ad-1", text: "대중교통 불편", emoji: "🚆", votes: 12 },
      { id: "c-ad-2", text: "인터넷 느림", emoji: "📡", votes: 10 },
    ],
    temps: [-2, 1, 6, 13, 18, 22, 26, 26, 21, 14, 7, 0],
    rain: [22, 25, 42, 62, 78, 118, 210, 190, 120, 38, 32, 18],
    humidity: [55, 52, 52, 55, 60, 70, 78, 78, 70, 60, 57, 55],
    nearbySlugs: ["daegu", "gyeongju", "pohang"],
  },
  {
    slug: "seogwipo", name: "서귀포", nameEn: "Seogwipo", region: "제주", category: "workation",
    description: "제주 남쪽의 온화한 도시. 제주시보다 따뜻하고 한적하며, 아름다운 해안 절경이 일품.",
    overallScore: 4.1, reviewCount: 68, monthlyCost: 125, internetSpeed: 85, currentTemp: 14, weatherIcon: "☀️", hasKTX: false, isSeaside: true,
    metricScores: { internet: 3.5, cost: 3.3, transport: 2.0, coworking: 2.8, safety: 4.5, food: 4.5, nature: 5.0, culture: 3.8, medical: 3.0, amenities: 3.2, community: 3.5, housing: 3.0 },
    rent: 50, food: 35, transport: 15, cafe: 15, utility: 10,
    highlights: ["🌴 온화한 기후", "🏝️ 해안절경", "🍊 감귤밭"],
    pros: [
      { id: "p-sg-1", text: "자연 좋음", emoji: "🌿", votes: 55 },
      { id: "p-sg-2", text: "날씨 좋음", emoji: "☀️", votes: 48 },
      { id: "p-sg-3", text: "힐링/워라밸", emoji: "🧘", votes: 42 },
    ],
    cons: [
      { id: "c-sg-1", text: "차 필수", emoji: "🚗", votes: 52 },
      { id: "c-sg-2", text: "이동 비용 높음", emoji: "✈️", votes: 38 },
      { id: "c-sg-3", text: "단기 임대 비쌈", emoji: "🏘️", votes: 30 },
    ],
    temps: [3, 4, 8, 13, 17, 21, 26, 28, 24, 18, 12, 6],
    rain: [55, 50, 80, 90, 85, 160, 200, 270, 190, 75, 70, 45],
    humidity: [68, 65, 65, 68, 72, 80, 84, 82, 78, 70, 68, 66],
    nearbySlugs: ["jeju", "yeosu", "tongyeong"],
  },
];

// ─── Review Data ─────────────────────────────────────────────────────

interface ReviewInput {
  id: string;
  citySlug: string;
  authorNickname: string;
  visitPeriod: string;
  duration: string;
  profession: string;
  overallScore: number;
  text: string;
  recommendation: string;
  createdAt: string;
  helpful: number;
  unhelpful: number;
}

const reviewsData: ReviewInput[] = [
  { id: "rv-jeju-1", citySlug: "jeju", authorNickname: "코딩하는감귤", visitPeriod: "2025년 10월 ~ 12월", duration: "1~3개월", profession: "개발자", overallScore: 4.5, text: "한 달 살기로 제주를 찾았는데 자연환경이 정말 힐링이 됩니다. 올레길 걸으면서 머리 식히고 카페에서 코딩하는 루틴이 최고였어요. 다만 렌터카 없으면 이동이 불편합니다.", recommendation: "추천", createdAt: "2025-12-15", helpful: 42, unhelpful: 3 },
  { id: "rv-jeju-2", citySlug: "jeju", authorNickname: "디자인제주러", visitPeriod: "2025년 7월 ~ 8월", duration: "1~4주", profession: "디자이너", overallScore: 3.5, text: "여름 성수기에 갔더니 관광객이 너무 많고 숙소비가 2배 이상이었어요. 비수기에 가는 걸 추천합니다. 코워킹 스페이스는 제주 창조경제혁신센터가 좋았어요.", recommendation: "보통", createdAt: "2025-09-02", helpful: 31, unhelpful: 5 },
  { id: "rv-jeju-3", citySlug: "jeju", authorNickname: "프리랜서노마드", visitPeriod: "2026년 1월 ~ 3월", duration: "1~3개월", profession: "마케터", overallScore: 4.0, text: "겨울 제주는 바람이 많이 불지만 한적해서 작업에 집중하기 좋았습니다. 노마드 커뮤니티 모임에 참여했는데 다양한 분야 사람들을 만날 수 있어서 좋았어요.", recommendation: "추천", createdAt: "2026-03-10", helpful: 28, unhelpful: 2 },
  { id: "rv-jeju-4", citySlug: "jeju", authorNickname: "감성작가", visitPeriod: "2025년 4월 ~ 5월", duration: "1~4주", profession: "작가/크리에이터", overallScore: 5.0, text: "봄 제주는 유채꽃이 만발하고 날씨도 따뜻해서 글쓰기에 최적의 환경이었습니다. 카페도 예쁜 곳이 많고 영감을 주는 풍경이 곳곳에 있어요. 인생 워케이션이었습니다.", recommendation: "추천", createdAt: "2025-06-01", helpful: 56, unhelpful: 1 },
  { id: "rv-gang-1", citySlug: "gangneung", authorNickname: "바다코더", visitPeriod: "2025년 9월 ~ 10월", duration: "1~4주", profession: "개발자", overallScore: 4.0, text: "KTX로 서울에서 2시간이면 올 수 있어서 접근성이 좋습니다. 안목 카페거리에서 바다 보며 작업하는 게 일상이었어요. 다만 코워킹 스페이스 선택지가 적습니다.", recommendation: "추천", createdAt: "2025-10-28", helpful: 35, unhelpful: 4 },
  { id: "rv-gang-2", citySlug: "gangneung", authorNickname: "커피러버", visitPeriod: "2025년 6월", duration: "1주 미만", profession: "기획자", overallScore: 4.5, text: "강릉 커피 축제에 맞춰 갔는데 카페 퀄리티가 서울 못지않습니다. 경포 해변 산책 후 작업하는 루틴이 정말 좋았어요. 물가도 저렴해서 장기 체류하고 싶었습니다.", recommendation: "추천", createdAt: "2025-07-15", helpful: 28, unhelpful: 2 },
  { id: "rv-gang-3", citySlug: "gangneung", authorNickname: "서핑개발자", visitPeriod: "2025년 8월", duration: "1~4주", profession: "개발자", overallScore: 3.5, text: "서핑하고 코딩하는 루틴을 꿈꿨는데 여름에는 관광객이 많아서 카페 자리 잡기가 힘들었어요. 하지만 아침 일찍 나가면 괜찮습니다.", recommendation: "보통", createdAt: "2025-09-05", helpful: 22, unhelpful: 3 },
  { id: "rv-jj-1", citySlug: "jeonju", authorNickname: "비빔밥덕후", visitPeriod: "2025년 11월 ~ 12월", duration: "1~4주", profession: "마케터", overallScore: 4.5, text: "전주 한옥마을 근처에서 한 달 살았는데 매일 다른 맛집을 발견하는 재미가 있었어요. 물가도 정말 저렴하고 카페도 아기자기해서 작업하기 좋았습니다.", recommendation: "추천", createdAt: "2025-12-20", helpful: 38, unhelpful: 1 },
  { id: "rv-jj-2", citySlug: "jeonju", authorNickname: "한옥러버", visitPeriod: "2026년 2월", duration: "1~4주", profession: "디자이너", overallScore: 4.0, text: "한옥 게스트하우스에서 지내며 작업했는데 분위기가 너무 좋았습니다. 다만 코워킹 스페이스가 많지 않아서 카페를 주로 이용했어요.", recommendation: "추천", createdAt: "2026-03-01", helpful: 25, unhelpful: 2 },
  { id: "rv-jj-3", citySlug: "jeonju", authorNickname: "막걸리코더", visitPeriod: "2025년 5월", duration: "1주 미만", profession: "개발자", overallScore: 3.5, text: "KTX로 접근성이 좋고 먹거리가 정말 최고입니다. 다만 여름에는 많이 덥고 할 거리가 먹는 것 위주라 장기 체류에는 좀 지루할 수 있어요.", recommendation: "보통", createdAt: "2025-06-10", helpful: 18, unhelpful: 4 },
  { id: "rv-bs-1", citySlug: "busan", authorNickname: "해운대코더", visitPeriod: "2025년 10월 ~ 11월", duration: "1~3개월", profession: "개발자", overallScore: 4.5, text: "해운대 근처 코워킹에서 일하면서 퇴근 후 해변 산책하는 루틴이 최고였습니다. 맛집도 많고 KTX로 서울 2시간 반이라 출장도 편해요.", recommendation: "추천", createdAt: "2025-11-25", helpful: 45, unhelpful: 2 },
  { id: "rv-bs-2", citySlug: "busan", authorNickname: "광안리러너", visitPeriod: "2025년 7월 ~ 8월", duration: "1~4주", profession: "기획자", overallScore: 3.5, text: "여름 부산은 정말 덥습니다. 하지만 광안리 야경은 최고고, 센텀시티 코워킹도 괜찮았어요. 비수기에 다시 가고 싶네요.", recommendation: "보통", createdAt: "2025-09-08", helpful: 30, unhelpful: 5 },
  { id: "rv-bs-3", citySlug: "busan", authorNickname: "부산토박이", visitPeriod: "2026년 1월 ~ 2월", duration: "1~3개월", profession: "디자이너", overallScore: 4.0, text: "겨울 부산은 서울보다 훨씬 따뜻해서 좋았습니다. 감천문화마을, 해리단길 등 영감을 주는 장소도 많고 해산물도 저렴해요.", recommendation: "추천", createdAt: "2026-02-28", helpful: 35, unhelpful: 3 },
  { id: "rv-se-1", citySlug: "seoul", authorNickname: "강남워커", visitPeriod: "2025년 전체", duration: "3개월 이상", profession: "개발자", overallScore: 3.5, text: "인프라는 최고지만 생활비가 부담됩니다. 코워킹 선택지가 많고 네트워킹 기회도 풍부하지만, 노마드 라이프스타일과는 좀 거리가 있어요.", recommendation: "보통", createdAt: "2025-12-30", helpful: 52, unhelpful: 8 },
  { id: "rv-se-2", citySlug: "seoul", authorNickname: "이태원프리", visitPeriod: "2025년 3월 ~ 5월", duration: "1~3개월", profession: "마케터", overallScore: 4.0, text: "외국인 노마드 커뮤니티가 활발하고 영어로도 생활 가능합니다. 코워킹도 다양하고 문화생활도 풍부해서 좋았어요. 월세만 아니라면...", recommendation: "추천", createdAt: "2025-06-15", helpful: 42, unhelpful: 5 },
  { id: "rv-se-3", citySlug: "seoul", authorNickname: "성수힙스터", visitPeriod: "2025년 8월 ~ 10월", duration: "1~3개월", profession: "디자이너", overallScore: 4.0, text: "성수동 코워킹 생태계가 정말 좋습니다. 카페도 인스타그래머블하고 영감 받을 곳이 많아요. 다만 주말에는 사람이 너무 많습니다.", recommendation: "추천", createdAt: "2025-10-30", helpful: 38, unhelpful: 3 },
];

// ─── Coworking Data ──────────────────────────────────────────────────

interface CoworkingInput {
  id: string;
  citySlug: string;
  name: string;
  address: string;
  dailyPrice: number;
  monthlyPrice: number | null;
  amenities: string[];
  hours: string;
  rating: number;
}

const coworkingsData: CoworkingInput[] = [
  { id: "cw-jeju-1", citySlug: "jeju", name: "제주 창조경제혁신센터", address: "제주시 연동 272-34", dailyPrice: 0, monthlyPrice: 0, amenities: ["무료 와이파이", "회의실", "프린터", "라운지", "주차장"], hours: "09:00 - 18:00 (주말 휴무)", rating: 4.2 },
  { id: "cw-jeju-2", citySlug: "jeju", name: "코워크제주", address: "제주시 노형동 925-10", dailyPrice: 15000, monthlyPrice: 220000, amenities: ["고속 와이파이", "개인 데스크", "회의실", "커피 무제한", "사물함"], hours: "08:00 - 22:00 (연중무휴)", rating: 4.5 },
  { id: "cw-jeju-3", citySlug: "jeju", name: "하이브제주", address: "제주시 한림읍 협재리 2480", dailyPrice: 20000, monthlyPrice: 280000, amenities: ["오션뷰", "고속 와이파이", "개인 부스", "카페", "테라스"], hours: "09:00 - 21:00 (연중무휴)", rating: 4.7 },
  { id: "cw-gang-1", citySlug: "gangneung", name: "강릉 창업카페", address: "강릉시 경포로 365", dailyPrice: 10000, monthlyPrice: 150000, amenities: ["와이파이", "회의실", "커피", "프린터"], hours: "09:00 - 20:00 (일요일 휴무)", rating: 3.8 },
  { id: "cw-gang-2", citySlug: "gangneung", name: "안목 코워킹", address: "강릉시 창해로 307", dailyPrice: 12000, monthlyPrice: 180000, amenities: ["바다뷰", "고속 와이파이", "개인 데스크", "커피 무제한"], hours: "08:00 - 21:00 (연중무휴)", rating: 4.3 },
  { id: "cw-jj-1", citySlug: "jeonju", name: "전주 한옥 코워킹", address: "전주시 완산구 교동 72-1", dailyPrice: 8000, monthlyPrice: 120000, amenities: ["와이파이", "한옥 분위기", "차 제공", "정원"], hours: "09:00 - 19:00 (월요일 휴무)", rating: 4.0 },
  { id: "cw-jj-2", citySlug: "jeonju", name: "전북창조경제혁신센터", address: "전주시 덕진구 기린대로 549", dailyPrice: 0, monthlyPrice: 0, amenities: ["무료 와이파이", "회의실", "프린터", "주차장"], hours: "09:00 - 18:00 (주말 휴무)", rating: 3.5 },
  { id: "cw-bs-1", citySlug: "busan", name: "센텀 코워킹 허브", address: "부산시 해운대구 센텀중앙로 97", dailyPrice: 18000, monthlyPrice: 250000, amenities: ["고속 와이파이", "개인 부스", "회의실", "카페", "주차장"], hours: "07:00 - 23:00 (연중무휴)", rating: 4.6 },
  { id: "cw-bs-2", citySlug: "busan", name: "해운대 비치워크", address: "부산시 해운대구 해운대해변로 298", dailyPrice: 22000, monthlyPrice: 300000, amenities: ["오션뷰", "고속 와이파이", "개인 데스크", "커피 무제한", "샤워실"], hours: "08:00 - 22:00 (연중무휴)", rating: 4.8 },
  { id: "cw-bs-3", citySlug: "busan", name: "부산 스타트업캠퍼스", address: "부산시 해운대구 APEC로 17", dailyPrice: 0, monthlyPrice: 0, amenities: ["무료 와이파이", "회의실", "세미나실", "주차장", "라운지"], hours: "09:00 - 18:00 (주말 휴무)", rating: 4.0 },
  { id: "cw-se-1", citySlug: "seoul", name: "위워크 강남", address: "서울시 강남구 테헤란로 152", dailyPrice: 35000, monthlyPrice: 450000, amenities: ["초고속 와이파이", "개인 부스", "회의실", "커피/맥주", "이벤트"], hours: "24시간 (연중무휴)", rating: 4.5 },
  { id: "cw-se-2", citySlug: "seoul", name: "패스트파이브 성수", address: "서울시 성동구 성수이로 51", dailyPrice: 25000, monthlyPrice: 350000, amenities: ["고속 와이파이", "개인 데스크", "회의실", "카페", "옥상"], hours: "24시간 (연중무휴)", rating: 4.4 },
  { id: "cw-se-3", citySlug: "seoul", name: "스파크플러스 홍대", address: "서울시 마포구 양화로 45", dailyPrice: 20000, monthlyPrice: 280000, amenities: ["고속 와이파이", "개인 부스", "회의실", "라운지", "주차장"], hours: "24시간 (연중무휴)", rating: 4.3 },
];

// ─── Programs & Meetups ──────────────────────────────────────────────

const programsData = [
  { id: "wp-1", citySlug: "jeju", title: "제주 디지털 노마드 워케이션", period: "2026년 4월 1일 ~ 4월 30일", subsidy: "숙박비 50% 지원 (최대 50만원)", description: "제주 창조경제혁신센터에서 운영하는 한 달 워케이션 프로그램입니다. 코워킹 스페이스 무료 이용, 네트워킹 행사, 지역 투어가 포함되어 있습니다." },
  { id: "wp-2", citySlug: "gangneung", title: "강릉 바다 워케이션 시즌3", period: "2026년 5월 12일 ~ 6월 8일", subsidy: "코워킹 무료 + 숙박비 30만원 지원", description: "경포 해변 인근 코워킹 스페이스에서 4주간 진행되는 워케이션 프로그램입니다. 서핑 체험, 커피 투어, 로컬 네트워킹이 포함됩니다." },
  { id: "wp-3", citySlug: "jeonju", title: "전주 한옥 크리에이터 캠프", period: "2026년 6월 1일 ~ 6월 28일", subsidy: "한옥 숙소 무료 제공 (4주)", description: "전주 한옥마을에서 진행되는 크리에이터 대상 워케이션입니다. 전통 문화 체험, 먹거리 투어, 콘텐츠 제작 워크숍이 포함됩니다." },
  { id: "wp-4", citySlug: "busan", title: "부산 해운대 스타트업 워케이션", period: "2026년 7월 7일 ~ 8월 1일", subsidy: "코워킹 무료 + 교통비 20만원 지원", description: "센텀시티 코워킹 허브에서 진행되는 스타트업 워케이션입니다. 멘토링, 투자 연계, BIFF 사전 네트워킹 프로그램이 포함됩니다." },
  { id: "wp-5", citySlug: "yeosu", title: "여수 힐링 워케이션", period: "2026년 9월 15일 ~ 10월 12일", subsidy: "숙박비 40만원 + 식비 20만원 지원", description: "여수 밤바다를 즐기며 일하는 힐링 워케이션입니다. 섬 투어, 해양 레저, 지역 음식 체험이 포함됩니다." },
];

const meetupsData = [
  { id: "mu-1", citySlug: "jeju", date: "2026-04-05", title: "제주 노마드 네트워킹 밋업 #42", attendees: 35 },
  { id: "mu-2", citySlug: "seoul", date: "2026-04-12", title: "서울 디지털 노마드 커피챗", attendees: 48 },
  { id: "mu-3", citySlug: "busan", date: "2026-04-19", title: "부산 해변 코워킹 데이", attendees: 22 },
  { id: "mu-4", citySlug: "gangneung", date: "2026-04-26", title: "강릉 카페 호핑 밋업", attendees: 15 },
  { id: "mu-5", citySlug: "jeonju", date: "2026-05-03", title: "전주 한옥마을 런치 밋업", attendees: 18 },
  { id: "mu-6", citySlug: "seoul", date: "2026-05-10", title: "서울 프리랜서 네트워킹 나이트", attendees: 62 },
];

// ─── Seed Function ───────────────────────────────────────────────────

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.reviewVote.deleteMany();
  await prisma.review.deleteMany();
  await prisma.coworkingSpace.deleteMany();
  await prisma.meetup.deleteMany();
  await prisma.workationProgram.deleteMany();
  await prisma.cityNearby.deleteMany();
  await prisma.cityPhoto.deleteMany();
  await prisma.monthlyWeather.deleteMany();
  await prisma.proConTag.deleteMany();
  await prisma.cityHighlight.deleteMany();
  await prisma.costItem.deleteMany();
  await prisma.cityMetric.deleteMany();
  await prisma.city.deleteMany();

  // Pass 1: Create all cities with nested data
  for (const c of citiesData) {
    const metrics = METRICS.map((m) => ({
      key: m.key,
      label: m.label,
      emoji: m.emoji,
      score: c.metricScores[m.key] ?? 3.0,
    }));

    const costs = [
      { category: "원룸 월세", amount: c.rent, unit: "만원/월" },
      { category: "식비", amount: c.food, unit: "만원/월" },
      { category: "교통비", amount: c.transport, unit: "만원/월" },
      { category: "카페", amount: c.cafe, unit: "만원/월" },
      { category: "유틸리티", amount: c.utility, unit: "만원/월" },
    ];

    const weather = c.temps.map((t, i) => ({
      month: i + 1,
      avgTemp: t,
      rainfall: c.rain[i],
      humidity: c.humidity[i],
    }));

    const photos = [
      `https://picsum.photos/seed/${c.slug}-1/800/500`,
      `https://picsum.photos/seed/${c.slug}-2/800/500`,
      `https://picsum.photos/seed/${c.slug}-3/800/500`,
    ];

    await prisma.city.create({
      data: {
        slug: c.slug,
        name: c.name,
        nameEn: c.nameEn,
        region: c.region,
        category: c.category,
        description: c.description,
        imageUrl: `https://picsum.photos/seed/${c.slug}/800/500`,
        overallScore: c.overallScore,
        reviewCount: c.reviewCount,
        monthlyCost: c.monthlyCost,
        internetSpeed: c.internetSpeed,
        currentTemp: c.currentTemp,
        weatherIcon: c.weatherIcon,
        hasKTX: c.hasKTX,
        isSeaside: c.isSeaside,
        metrics: { create: metrics },
        costs: { create: costs },
        highlights: { create: c.highlights.map((h) => ({ text: h })) },
        tags: {
          create: [
            ...c.pros.map((p) => ({ id: p.id, text: p.text, emoji: p.emoji, type: "pro", votes: p.votes })),
            ...c.cons.map((co) => ({ id: co.id, text: co.text, emoji: co.emoji, type: "con", votes: co.votes })),
          ],
        },
        weather: { create: weather },
        photos: { create: photos.map((url) => ({ url })) },
      },
    });
  }

  // Pass 2: Create nearby relationships
  for (const c of citiesData) {
    for (const toSlug of c.nearbySlugs) {
      const exists = citiesData.find((x) => x.slug === toSlug);
      if (!exists) continue;
      await prisma.cityNearby.create({
        data: { fromSlug: c.slug, toSlug },
      }).catch(() => {}); // Ignore duplicates
    }
  }

  // Create seed user for reviews
  const seedUser = await prisma.user.upsert({
    where: { email: "seed@knomad.kr" },
    update: {},
    create: {
      email: "seed@knomad.kr",
      name: "시드유저",
      nickname: "시드유저",
      tier: "free",
    },
  });

  // Create reviews
  for (const r of reviewsData) {
    await prisma.review.create({
      data: {
        id: r.id,
        citySlug: r.citySlug,
        authorId: seedUser.id,
        authorNickname: r.authorNickname,
        visitPeriod: r.visitPeriod,
        duration: r.duration,
        profession: r.profession,
        overallScore: r.overallScore,
        text: r.text,
        recommendation: r.recommendation,
        helpful: r.helpful,
        unhelpful: r.unhelpful,
        createdAt: new Date(r.createdAt),
      },
    });
  }

  // Create coworkings
  for (const cw of coworkingsData) {
    await prisma.coworkingSpace.create({
      data: {
        id: cw.id,
        citySlug: cw.citySlug,
        name: cw.name,
        address: cw.address,
        dailyPrice: cw.dailyPrice,
        monthlyPrice: cw.monthlyPrice,
        amenities: JSON.stringify(cw.amenities),
        hours: cw.hours,
        rating: cw.rating,
        imageUrl: `https://picsum.photos/seed/${cw.id}/400/300`,
      },
    });
  }

  // Create programs
  for (const p of programsData) {
    await prisma.workationProgram.create({
      data: {
        id: p.id,
        citySlug: p.citySlug,
        title: p.title,
        period: p.period,
        subsidy: p.subsidy,
        description: p.description,
      },
    });
  }

  // Create meetups
  for (const m of meetupsData) {
    await prisma.meetup.create({
      data: {
        id: m.id,
        citySlug: m.citySlug,
        date: m.date,
        title: m.title,
        attendees: m.attendees,
      },
    });
  }

  console.log("Seeding complete!");
  console.log(`  - ${citiesData.length} cities`);
  console.log(`  - ${reviewsData.length} reviews`);
  console.log(`  - ${coworkingsData.length} coworking spaces`);
  console.log(`  - ${programsData.length} programs`);
  console.log(`  - ${meetupsData.length} meetups`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
