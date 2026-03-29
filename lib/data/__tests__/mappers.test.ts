import {
  mapCityCard,
  mapCity,
  mapReview,
  mapCoworking,
  mapProgram,
  mapMeetup,
} from "@/lib/data/mappers";

// ── Mock data factories ──

function makeMockMetric(overrides = {}) {
  return {
    id: "m1",
    citySlug: "seoul",
    key: "internet",
    label: "인터넷",
    emoji: "🌐",
    score: 4.2,
    detail: "빠른 속도",
    ...overrides,
  };
}

function makeMockHighlight(overrides = {}) {
  return { id: "h1", citySlug: "seoul", text: "카페가 많음", ...overrides };
}

function makeMockCityBase(overrides = {}) {
  return {
    slug: "seoul",
    name: "서울",
    nameEn: "Seoul",
    region: "수도권",
    category: "대도시",
    description: "대한민국의 수도",
    imageUrl: "/images/seoul.jpg",
    overallScore: 4.3,
    reviewCount: 120,
    monthlyCost: 1500000,
    internetSpeed: 200,
    currentTemp: 18,
    weatherIcon: "sunny",
    hasKTX: true,
    isSeaside: false,
    likes: 300,
    dislikes: 10,
    environment: ["도심", "문화"],
    bestSeason: ["봄", "가을"],
    latitude: 37.5665,
    longitude: 126.978,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-06-01"),
    ...overrides,
  };
}

function makeMockCityCard(overrides = {}) {
  return {
    ...makeMockCityBase(),
    metrics: [makeMockMetric()],
    highlights: [makeMockHighlight()],
    ...overrides,
  };
}

function makeMockTag(overrides = {}) {
  return {
    id: "t1",
    citySlug: "seoul",
    text: "교통 편리",
    emoji: "🚇",
    type: "pro",
    votes: 42,
    ...overrides,
  };
}

function makeMockCost(overrides = {}) {
  return {
    id: "c1",
    citySlug: "seoul",
    category: "숙소",
    amount: 600000,
    unit: "월",
    ...overrides,
  };
}

function makeMockWeather(overrides = {}) {
  return {
    id: "w1",
    citySlug: "seoul",
    month: 3,
    avgTemp: 10.5,
    rainfall: 47,
    humidity: 55,
    ...overrides,
  };
}

function makeMockPhoto(overrides = {}) {
  return { id: "p1", citySlug: "seoul", url: "/photos/seoul-1.jpg", ...overrides };
}

function makeMockNearby(overrides = {}) {
  return { id: "n1", fromSlug: "seoul", toSlug: "incheon", ...overrides };
}

function makeMockCityFull(overrides = {}) {
  return {
    ...makeMockCityBase(),
    metrics: [makeMockMetric()],
    highlights: [makeMockHighlight()],
    tags: [
      makeMockTag({ id: "t1", type: "pro", text: "교통 편리" }),
      makeMockTag({ id: "t2", type: "con", text: "비싼 물가", emoji: "💸" }),
    ],
    costs: [makeMockCost()],
    weather: [makeMockWeather()],
    photos: [makeMockPhoto()],
    nearbyFrom: [makeMockNearby()],
    ...overrides,
  };
}

function makeMockReview(overrides = {}) {
  return {
    id: "r1",
    citySlug: "seoul",
    authorNickname: "노마드짱",
    visitPeriod: "2025-03",
    duration: "1개월",
    profession: "개발자",
    overallScore: 4.0,
    text: "좋았습니다",
    recommendation: "recommend",
    createdAt: new Date("2025-06-15T09:30:00Z"),
    helpful: 10,
    unhelpful: 1,
    ...overrides,
  };
}

function makeMockCoworking(overrides = {}) {
  return {
    id: "cw1",
    citySlug: "seoul",
    name: "코워킹 서울",
    address: "강남구 역삼동",
    dailyPrice: 15000,
    monthlyPrice: 250000,
    amenities: ["wifi", "프린터", "회의실"],
    hours: "09:00-22:00",
    rating: 4.5,
    imageUrl: "/images/cw-seoul.jpg",
    ...overrides,
  };
}

function makeMockProgram(overrides = {}) {
  return {
    id: "pg1",
    citySlug: "gangneung",
    title: "강릉 워케이션 프로그램",
    period: "2025-07 ~ 2025-08",
    subsidy: "최대 50만원",
    description: "강릉에서 일하며 쉬세요",
    ...overrides,
  };
}

function makeMockMeetup(overrides = {}) {
  return {
    id: "mt1",
    citySlug: "jeju",
    date: "2025-07-20",
    title: "제주 노마드 밋업",
    attendees: 25,
    ...overrides,
  };
}

// ── mapCityCard ──

describe("mapCityCard", () => {
  it("maps slug, name, nameEn correctly", () => {
    const result = mapCityCard(makeMockCityCard() as any);
    expect(result.slug).toBe("seoul");
    expect(result.name).toBe("서울");
    expect(result.nameEn).toBe("Seoul");
  });

  it("maps region and category as string values", () => {
    const result = mapCityCard(makeMockCityCard() as any);
    expect(result.region).toBe("수도권");
    expect(result.category).toBe("대도시");
  });

  it("maps numeric fields (overallScore, reviewCount, monthlyCost, internetSpeed, currentTemp)", () => {
    const result = mapCityCard(makeMockCityCard() as any);
    expect(result.overallScore).toBe(4.3);
    expect(result.reviewCount).toBe(120);
    expect(result.monthlyCost).toBe(1500000);
    expect(result.internetSpeed).toBe(200);
    expect(result.currentTemp).toBe(18);
  });

  it("maps boolean fields (hasKTX, isSeaside)", () => {
    const result = mapCityCard(makeMockCityCard() as any);
    expect(result.hasKTX).toBe(true);
    expect(result.isSeaside).toBe(false);
  });

  it("maps metrics with correct structure", () => {
    const result = mapCityCard(makeMockCityCard() as any);
    expect(result.metrics).toHaveLength(1);
    expect(result.metrics[0]).toEqual({
      key: "internet",
      label: "인터넷",
      emoji: "🌐",
      score: 4.2,
      detail: "빠른 속도",
    });
  });

  it("maps highlights to string array from .text", () => {
    const result = mapCityCard(makeMockCityCard() as any);
    expect(result.highlights).toEqual(["카페가 많음"]);
  });

  it("casts environment and bestSeason as string[]", () => {
    const result = mapCityCard(makeMockCityCard() as any);
    expect(result.environment).toEqual(["도심", "문화"]);
    expect(result.bestSeason).toEqual(["봄", "가을"]);
  });

  it("returns empty arrays for costs, pros, cons, weather, nearbySlugs, photos", () => {
    const result = mapCityCard(makeMockCityCard() as any);
    expect(result.costs).toEqual([]);
    expect(result.pros).toEqual([]);
    expect(result.cons).toEqual([]);
    expect(result.weather).toEqual([]);
    expect(result.nearbySlugs).toEqual([]);
    expect(result.photos).toEqual([]);
  });
});

// ── mapCity ──

describe("mapCity", () => {
  it("maps all scalar fields", () => {
    const result = mapCity(makeMockCityFull() as any);
    expect(result.slug).toBe("seoul");
    expect(result.description).toBe("대한민국의 수도");
    expect(result.imageUrl).toBe("/images/seoul.jpg");
    expect(result.weatherIcon).toBe("sunny");
  });

  it("splits tags into pros (type=pro) and cons (type=con)", () => {
    const result = mapCity(makeMockCityFull() as any);
    expect(result.pros).toHaveLength(1);
    expect(result.pros[0].text).toBe("교통 편리");
    expect(result.cons).toHaveLength(1);
    expect(result.cons[0].text).toBe("비싼 물가");
  });

  it("maps costs with category, amount, unit", () => {
    const result = mapCity(makeMockCityFull() as any);
    expect(result.costs).toHaveLength(1);
    expect(result.costs[0]).toEqual({ category: "숙소", amount: 600000, unit: "월" });
  });

  it("maps weather entries", () => {
    const result = mapCity(makeMockCityFull() as any);
    expect(result.weather).toHaveLength(1);
    expect(result.weather[0]).toEqual({ month: 3, avgTemp: 10.5, rainfall: 47, humidity: 55 });
  });

  it("maps nearbyFrom to nearbySlugs (toSlug values)", () => {
    const result = mapCity(makeMockCityFull() as any);
    expect(result.nearbySlugs).toEqual(["incheon"]);
  });

  it("maps photos to url strings", () => {
    const result = mapCity(makeMockCityFull() as any);
    expect(result.photos).toEqual(["/photos/seoul-1.jpg"]);
  });
});

// ── mapReview ──

describe("mapReview", () => {
  it("converts Date createdAt to ISO date string (YYYY-MM-DD)", () => {
    const result = mapReview(makeMockReview() as any);
    expect(result.createdAt).toBe("2025-06-15");
  });

  it("converts string createdAt to string via String()", () => {
    const result = mapReview(makeMockReview({ createdAt: "2025-01-01" }) as any);
    expect(result.createdAt).toBe("2025-01-01");
  });

  it("maps all review scalar fields", () => {
    const result = mapReview(makeMockReview() as any);
    expect(result.id).toBe("r1");
    expect(result.authorNickname).toBe("노마드짱");
    expect(result.overallScore).toBe(4.0);
    expect(result.recommendation).toBe("recommend");
    expect(result.helpful).toBe(10);
  });
});

// ── mapCoworking ──

describe("mapCoworking", () => {
  it("casts amenities as string[]", () => {
    const result = mapCoworking(makeMockCoworking() as any);
    expect(result.amenities).toEqual(["wifi", "프린터", "회의실"]);
  });

  it("converts null monthlyPrice to undefined", () => {
    const result = mapCoworking(makeMockCoworking({ monthlyPrice: null }) as any);
    expect(result.monthlyPrice).toBeUndefined();
  });
});

// ── mapProgram ──

describe("mapProgram", () => {
  it("maps citySlug to city field", () => {
    const result = mapProgram(makeMockProgram() as any);
    expect(result.city).toBe("gangneung");
    expect(result.title).toBe("강릉 워케이션 프로그램");
  });
});

// ── mapMeetup ──

describe("mapMeetup", () => {
  it("maps citySlug to city field", () => {
    const result = mapMeetup(makeMockMeetup() as any);
    expect(result.city).toBe("jeju");
    expect(result.title).toBe("제주 노마드 밋업");
    expect(result.attendees).toBe(25);
  });
});
