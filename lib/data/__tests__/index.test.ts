const mockFindMany = vi.fn();
const mockFindUnique = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    city: {
      findMany: (...args: any[]) => mockFindMany(...args),
      findUnique: (...args: any[]) => mockFindUnique(...args),
    },
  },
}));

vi.mock("../mappers", () => ({
  mapCityCard: vi.fn((raw: any) => ({ slug: raw.slug })),
  mapCity: vi.fn((raw: any) => ({ slug: raw.slug })),
}));

import { getAllCities, filterCities, getCityBySlug } from "../index";

beforeEach(() => {
  vi.clearAllMocks();
  mockFindMany.mockResolvedValue([{ slug: "jeju" }]);
  mockFindUnique.mockResolvedValue({ slug: "jeju" });
});

// ── getAllCities ──────────────────────────────────────────────

describe("getAllCities", () => {
  it("calls findMany with orderBy likes desc", async () => {
    await getAllCities();
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { likes: "desc" } })
    );
  });

  it("includes metrics and highlights", async () => {
    await getAllCities();
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ include: { metrics: true, highlights: true } })
    );
  });

  it("maps raw results through mapCityCard", async () => {
    const result = await getAllCities();
    expect(result).toEqual([{ slug: "jeju" }]);
  });
});

// ── filterCities ─────────────────────────────────────────────

describe("filterCities", () => {
  it("passes no where conditions for empty params", async () => {
    await filterCities({});
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });

  it("filters by region when provided", async () => {
    await filterCities({ region: "제주" });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ region: "제주" }) })
    );
  });

  it("ignores region when value is 'all'", async () => {
    await filterCities({ region: "all" });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });

  it("filters maxCost with lte for numeric values", async () => {
    await filterCities({ maxCost: "80" });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ monthlyCost: { lte: 80 } }),
      })
    );
  });

  it("filters maxCost with gt for '160+'", async () => {
    await filterCities({ maxCost: "160+" });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ monthlyCost: { gt: 160 } }),
      })
    );
  });

  it("filters by environment with array_contains", async () => {
    await filterCities({ environment: "바다" });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ environment: { array_contains: ["바다"] } }),
      })
    );
  });

  it("filters by bestSeason with array_contains", async () => {
    await filterCities({ bestSeason: "가을" });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ bestSeason: { array_contains: ["가을"] } }),
      })
    );
  });
});

// ── getCityBySlug ────────────────────────────────────────────

describe("getCityBySlug", () => {
  it("returns mapped city for existing slug", async () => {
    const result = await getCityBySlug("jeju");
    expect(result).toEqual({ slug: "jeju" });
    expect(mockFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { slug: "jeju" } })
    );
  });

  it("returns null for non-existing slug", async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await getCityBySlug("nonexist");
    expect(result).toBeNull();
  });
});
