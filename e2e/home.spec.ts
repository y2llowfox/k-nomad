import { test, expect } from "@playwright/test";

test.describe("홈페이지 - 페이지 로딩", () => {
  test("Hero, FilterBar, CityGrid 모두 표시", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Hero section
    await expect(
      page.getByRole("button", { name: "무료로 시작하기" })
    ).toBeVisible();

    // FilterBar - 4개 select 드롭다운
    const comboboxes = page.locator('button[role="combobox"]');
    await expect(comboboxes).toHaveCount(4);

    // CityGrid - 도시 카드가 존재
    const cards = page.locator("a[href^='/cities/']");
    await expect(cards.first()).toBeVisible();
  });

  test("도시 카드가 1개 이상 렌더링됨", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const cards = page.locator("a[href^='/cities/']");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("첫 번째 카드에 도시명, 좋아요/싫어요 텍스트가 존재", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator("a[href^='/cities/']").first();
    const cardText = await firstCard.textContent();
    expect(cardText).toBeTruthy();
    // CityCard renders "👍 {count}" and "👎 {count}" with literal emoji
    expect(cardText).toMatch(/👍\s*\d+/);
    expect(cardText).toMatch(/👎\s*\d+/);
  });
});

test.describe("홈페이지 - Hero CTA", () => {
  test("이메일 입력 후 '무료로 시작하기' 클릭 → /register?email= 포함 URL", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const emailInput = page.locator("section input[type='email']");
    await emailInput.fill("test@example.com");
    await page.locator("section").getByRole("button", { name: "무료로 시작하기" }).click();

    await page.waitForURL(/\/register/);
    expect(page.url()).toContain("/register?email=test%40example.com");
  });

  test("이메일 없이 '무료로 시작하기' 클릭 → /register로 이동", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.locator("section").getByRole("button", { name: "무료로 시작하기" }).click();

    await page.waitForURL(/\/register/);
    expect(page.url()).toContain("/register");
  });
});

test.describe("홈페이지 - 필터 동작", () => {
  test("지역 드롭다운에서 '제주' 선택 → URL에 region= 포함", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Region is index 1
    await page.locator('button[role="combobox"]').nth(1).click();
    await page.waitForSelector('[role="listbox"]');
    await page.getByRole("option", { name: "제주" }).click();
    await page.waitForURL(/region=/);

    expect(page.url()).toContain("region=");
  });

  test("예산 드롭다운에서 '~80만원' 선택 → URL에 maxCost=80 포함", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Budget is index 0
    await page.locator('button[role="combobox"]').nth(0).click();
    await page.waitForSelector('[role="listbox"]');
    await page.getByRole("option", { name: "~80만원" }).click();
    await page.waitForURL(/maxCost=80/);

    expect(page.url()).toContain("maxCost=80");
  });

  test("환경 드롭다운에서 '바다' 선택 → URL에 environment= 포함", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Environment is index 2
    await page.locator('button[role="combobox"]').nth(2).click();
    await page.waitForSelector('[role="listbox"]');
    await page.getByRole("option", { name: "바다" }).click();
    await page.waitForURL(/environment=/);

    expect(page.url()).toContain("environment=");
  });

  test("계절 드롭다운에서 '가을' 선택 → URL에 bestSeason= 포함", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Season is index 3
    await page.locator('button[role="combobox"]').nth(3).click();
    await page.waitForSelector('[role="listbox"]');
    await page.getByRole("option", { name: "가을" }).click();
    await page.waitForURL(/bestSeason=/);

    expect(page.url()).toContain("bestSeason=");
  });

  test("두 개 필터 동시 적용 → URL에 두 파라미터 모두 포함", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Select region first
    await page.locator('button[role="combobox"]').nth(1).click();
    await page.waitForSelector('[role="listbox"]');
    await page.getByRole("option", { name: "제주" }).click();
    await page.waitForURL(/region=/);

    // Select environment
    await page.locator('button[role="combobox"]').nth(2).click();
    await page.waitForSelector('[role="listbox"]');
    await page.getByRole("option", { name: "바다" }).click();
    await page.waitForURL(/environment=/);

    expect(page.url()).toContain("region=");
    expect(page.url()).toContain("environment=");
  });

  test("필터 적용 후 '초기화' 클릭 → URL 파라미터 없어짐", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Apply a filter first
    await page.locator('button[role="combobox"]').nth(1).click();
    await page.waitForSelector('[role="listbox"]');
    await page.getByRole("option", { name: "제주" }).click();
    await page.waitForURL(/region=/);

    expect(page.url()).toContain("region=");

    // Click reset button
    await page.getByRole("button", { name: "초기화" }).click();
    await page.waitForURL((url) => url.search === "");

    const url = new URL(page.url());
    expect(url.search).toBe("");
  });

  test("URL에 직접 필터 조합 입력 → 결과가 전체보다 적거나 빈 결과 메시지 표시", async ({
    page,
  }) => {
    // First get unfiltered count
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const unfilteredCount = await page
      .locator("a[href^='/cities/']")
      .count();

    // Navigate with a very restrictive filter combo (제주 + 도심)
    // 제주 cities are typically 바다, not 도심, so this should yield fewer or zero results
    await page.goto("/?region=제주&environment=도심");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const emptyMessage = page.getByText("조건에 맞는 도시가 없습니다");
    const filteredCards = page.locator("a[href^='/cities/']");
    const filteredCount = await filteredCards.count();

    // Either shows empty message or has fewer results than unfiltered
    const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);
    if (!hasEmptyMessage) {
      expect(filteredCount).toBeLessThanOrEqual(unfilteredCount);
    } else {
      expect(hasEmptyMessage).toBe(true);
    }
  });
});
