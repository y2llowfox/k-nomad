const mockFilterCities = vi.fn();

vi.mock("@/lib/data", () => ({
  filterCities: (...args: any[]) => mockFilterCities(...args),
}));

import { GET } from "../route";

beforeEach(() => {
  vi.clearAllMocks();
  mockFilterCities.mockResolvedValue([{ slug: "jeju" }, { slug: "busan" }]);
});

describe("GET /api/cities", () => {
  it("calls filterCities with all undefined when no params", async () => {
    const req = new Request("http://localhost/api/cities");
    await GET(req);

    expect(mockFilterCities).toHaveBeenCalledWith({
      region: undefined,
      maxCost: undefined,
      environment: undefined,
      bestSeason: undefined,
    });
  });

  it("passes region param to filterCities", async () => {
    const req = new Request("http://localhost/api/cities?region=제주");
    await GET(req);

    expect(mockFilterCities).toHaveBeenCalledWith(
      expect.objectContaining({ region: "제주" })
    );
  });

  it("passes compound filter params to filterCities", async () => {
    const req = new Request(
      "http://localhost/api/cities?maxCost=80&environment=바다"
    );
    await GET(req);

    expect(mockFilterCities).toHaveBeenCalledWith(
      expect.objectContaining({ maxCost: "80", environment: "바다" })
    );
  });

  it("returns a JSON array", async () => {
    const req = new Request("http://localhost/api/cities");
    const res = await GET(req);
    const body = await res.json();

    expect(Array.isArray(body)).toBe(true);
    expect(body).toEqual([{ slug: "jeju" }, { slug: "busan" }]);
  });

  it("responds with status 200", async () => {
    const req = new Request("http://localhost/api/cities");
    const res = await GET(req);

    expect(res.status).toBe(200);
  });
});
