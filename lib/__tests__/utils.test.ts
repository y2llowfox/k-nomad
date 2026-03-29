import { cn, getScoreColor, getScoreTextColor, getScoreLabel, formatCost } from "@/lib/utils";

describe("cn", () => {
  it("merges multiple class strings", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("ignores falsy values", () => {
    expect(cn("px-4", false && "hidden", null, undefined, "py-2")).toBe("px-4 py-2");
  });

  it("resolves tailwind conflicts (last wins)", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});

describe("getScoreColor", () => {
  it("returns bg-emerald-500 for score >= 4.5", () => {
    expect(getScoreColor(4.5)).toBe("bg-emerald-500");
  });

  it("returns bg-green-500 for score >= 3.5", () => {
    expect(getScoreColor(3.5)).toBe("bg-green-500");
  });

  it("returns bg-yellow-500 for score >= 2.5", () => {
    expect(getScoreColor(2.5)).toBe("bg-yellow-500");
  });

  it("returns bg-orange-500 for score >= 1.5", () => {
    expect(getScoreColor(1.5)).toBe("bg-orange-500");
  });

  it("returns bg-red-500 for score < 1.5", () => {
    expect(getScoreColor(1.0)).toBe("bg-red-500");
  });
});

describe("getScoreTextColor", () => {
  it("returns text-emerald-600 for score >= 4.5", () => {
    expect(getScoreTextColor(5.0)).toBe("text-emerald-600");
  });

  it("returns text-red-600 for score < 1.5", () => {
    expect(getScoreTextColor(0.5)).toBe("text-red-600");
  });
});

describe("getScoreLabel", () => {
  it("returns '매우좋음' for score >= 4.5", () => {
    expect(getScoreLabel(4.5)).toBe("매우좋음");
  });

  it("returns '좋음' for score >= 3.5", () => {
    expect(getScoreLabel(4.0)).toBe("좋음");
  });

  it("returns '나쁨' for score < 1.5", () => {
    expect(getScoreLabel(1.0)).toBe("나쁨");
  });
});

describe("formatCost", () => {
  it("formats amounts >= 10000 as ₩N만", () => {
    expect(formatCost(50000)).toBe("₩5만");
  });

  it("formats amounts < 10000 with locale string", () => {
    expect(formatCost(8500)).toBe("₩8,500");
  });
});
