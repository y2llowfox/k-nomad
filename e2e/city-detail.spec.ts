import { test, expect } from "@playwright/test";

test.describe("도시 상세페이지 - 페이지 로딩", () => {
  test("/cities/jeju 접속 → '제주' 텍스트 표시", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText("제주");
  });

  test("'Jeju' 영문명 표시", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    // The English name is in a <p> right after the h1 inside the hero overlay
    await expect(page.locator("h1 + p")).toContainText("Jeju");
  });

  test("예산, 지역, 환경, 최고의 계절 4개 정보 라벨 표시", async ({
    page,
  }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    // Use more specific selectors to avoid matching filter bar labels
    // The detail page renders labels like "💰 예산", "📍 지역", "🌿 환경", "🌸 최고의 계절"
    // inside <p class="text-sm text-muted-foreground"> elements within bordered cards
    const infoGrid = page.locator(".grid");
    await expect(infoGrid.getByText("예산")).toBeVisible();
    await expect(infoGrid.getByText("지역")).toBeVisible();
    await expect(infoGrid.getByText("환경")).toBeVisible();
    await expect(infoGrid.getByText("최고의 계절")).toBeVisible();
  });

  test("좋아요/싫어요 버튼 2개 표시", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("button", { name: /좋아요/ })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /싫어요/ })
    ).toBeVisible();
  });

  test("도시 설명 텍스트 존재 (빈 문자열 아님)", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    // The description should be a non-empty text block on the page
    // Look for a paragraph or text section with substantial content
    const body = await page.locator("main").textContent();
    expect(body).toBeTruthy();
    expect(body!.length).toBeGreaterThan(50);
  });
});

test.describe("도시 상세페이지 - 네비게이션", () => {
  test("'← 목록으로' 클릭 → /로 이동", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    await page.getByText("목록으로").click();

    await page.waitForURL("/");
    expect(page.url()).toMatch(/\/$/);
  });

  test("홈에서 첫 번째 카드 클릭 → /cities/ 포함 URL로 이동", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator("a[href^='/cities/']").first();
    await firstCard.click();

    await page.waitForURL(/\/cities\//);
    expect(page.url()).toContain("/cities/");
  });
});

test.describe("도시 상세페이지 - 에러", () => {
  test("/cities/this-city-does-not-exist → '도시를 찾을 수 없습니다' 표시", async ({
    page,
  }) => {
    await page.goto("/cities/this-city-does-not-exist");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("도시를 찾을 수 없습니다")).toBeVisible();
  });
});
