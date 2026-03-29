import { render, screen } from "@testing-library/react";
import CityGrid from "../CityGrid";
import { City } from "@/lib/types";

vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

const mockCity: City = {
  slug: "jeju",
  name: "제주",
  nameEn: "Jeju",
  region: "제주" as const,
  category: "workation" as const,
  description: "대한민국 대표 워케이션 도시",
  imageUrl: "https://example.com/jeju.jpg",
  overallScore: 4.3,
  reviewCount: 156,
  metrics: [],
  costs: [],
  monthlyCost: 130,
  internetSpeed: 95,
  currentTemp: 12,
  weatherIcon: "⛅",
  hasKTX: false,
  isSeaside: true,
  likes: 124,
  dislikes: 8,
  environment: ["바다", "산·자연"],
  bestSeason: ["봄", "가을"],
  highlights: [],
  pros: [],
  cons: [],
  weather: [],
  nearbySlugs: [],
  photos: [],
};

const makeCities = (count: number): City[] =>
  Array.from({ length: count }, (_, i) => ({
    ...mockCity,
    slug: `city-${i}`,
    name: `도시${i}`,
    nameEn: `City${i}`,
  }));

describe("CityGrid", () => {
  it("빈 배열이면 '조건에 맞는 도시가 없습니다' 텍스트를 표시한다", () => {
    render(<CityGrid cities={[]} />);
    expect(screen.getByText("조건에 맞는 도시가 없습니다")).toBeInTheDocument();
  });

  it("3개 도시를 전달하면 3개의 도시명이 렌더링된다", () => {
    const cities = makeCities(3);
    render(<CityGrid cities={cities} />);
    expect(screen.getByText("도시0")).toBeInTheDocument();
    expect(screen.getByText("도시1")).toBeInTheDocument();
    expect(screen.getByText("도시2")).toBeInTheDocument();
  });

  it("'도시 리스트' 텍스트가 표시된다", () => {
    const cities = makeCities(1);
    render(<CityGrid cities={cities} />);
    expect(screen.getByText("도시 리스트")).toBeInTheDocument();
  });
});
