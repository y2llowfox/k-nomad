import { render, screen } from "@testing-library/react";
import CityDetail from "../CityDetail";
import { City } from "@/lib/types";

vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

global.fetch = vi.fn();

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

describe("CityDetail", () => {
  it("도시명과 영문명을 렌더링한다", () => {
    render(<CityDetail city={mockCity} />);
    expect(screen.getByRole("heading", { name: "제주" })).toBeInTheDocument();
    expect(screen.getByText("Jeju")).toBeInTheDocument();
  });

  it("4개 정보 카드를 표시한다", () => {
    render(<CityDetail city={mockCity} />);
    expect(screen.getByText((_, el) => el?.tagName === "P" && el.textContent === "130만원/월")).toBeInTheDocument();
    expect(screen.getByText((_, el) => el?.tagName === "P" && el.className.includes("font-semibold") && el.textContent === "제주")).toBeInTheDocument();
    expect(screen.getByText("바다, 산·자연")).toBeInTheDocument();
    expect(screen.getByText("봄, 가을")).toBeInTheDocument();
  });

  it("좋아요/싫어요 버튼과 초기 카운트를 표시한다", () => {
    render(<CityDetail city={mockCity} />);
    expect(screen.getByRole("button", { name: /좋아요 124/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /싫어요 8/ })).toBeInTheDocument();
  });

  it("'← 목록으로' 링크의 href가 '/'이다", () => {
    render(<CityDetail city={mockCity} />);
    const backLink = screen.getByText("← 목록으로");
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("도시 설명 텍스트를 렌더링한다", () => {
    render(<CityDetail city={mockCity} />);
    expect(screen.getByText("대한민국 대표 워케이션 도시")).toBeInTheDocument();
  });

  it("Hero 이미지 배경 스타일이 적용된다", () => {
    const { container } = render(<CityDetail city={mockCity} />);
    const heroDiv = container.querySelector(".bg-cover.bg-center.relative") as HTMLElement;
    expect(heroDiv).not.toBeNull();
    expect(heroDiv.getAttribute("style")).toContain("https://example.com/jeju.jpg");
  });
});
