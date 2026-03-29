import { render, screen } from "@testing-library/react";
import CityCard from "../CityCard";
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

describe("CityCard", () => {
  it("도시명과 영문명을 렌더링한다", () => {
    render(<CityCard city={mockCity} />);
    expect(screen.getByText("제주")).toBeInTheDocument();
    expect(screen.getByText("Jeju")).toBeInTheDocument();
  });

  it("예산을 '130만원/월' 형식으로 표시한다", () => {
    render(<CityCard city={mockCity} />);
    expect(screen.getByText(/130만원\/월/)).toBeInTheDocument();
  });

  it("지역, 환경, 계절을 표시한다", () => {
    render(<CityCard city={mockCity} />);
    expect(screen.getByText((_, el) => el?.tagName === "SPAN" && el.textContent === "📍 제주")).toBeInTheDocument();
    expect(screen.getByText((_, el) => el?.tagName === "SPAN" && el.textContent === "🌿 바다, 산·자연")).toBeInTheDocument();
    expect(screen.getByText((_, el) => el?.tagName === "SPAN" && el.textContent === "🌸 봄, 가을")).toBeInTheDocument();
  });

  it("좋아요/싫어요 수를 표시한다", () => {
    render(<CityCard city={mockCity} />);
    expect(screen.getByText(/👍 124/)).toBeInTheDocument();
    expect(screen.getByText(/👎 8/)).toBeInTheDocument();
  });

  it("링크 href가 /cities/jeju이다", () => {
    render(<CityCard city={mockCity} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/cities/jeju");
  });

  it("빈 environment/bestSeason 배열일 때 '-'을 표시한다", () => {
    const emptyCity: City = {
      ...mockCity,
      slug: "empty-city",
      environment: [],
      bestSeason: [],
    };
    render(<CityCard city={emptyCity} />);
    const dashes = screen.getAllByText((_, el) => el?.tagName === "SPAN" && el.textContent?.trim() === "🌿 -" || el?.tagName === "SPAN" && el.textContent?.trim() === "🌸 -");
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });
});
