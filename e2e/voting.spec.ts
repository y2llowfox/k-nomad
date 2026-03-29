import { test, expect } from "@playwright/test";
import { loginAsTestUser } from "./fixtures/test-utils";

// ─── 비로그인 투표 ───────────────────────────────────────────────

test.describe("비로그인 투표", () => {
  test("비로그인 좋아요 클릭 → /login 리다이렉트", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    const likeButton = page.getByRole("button", { name: /좋아요/ });
    await likeButton.click();
    await page.waitForURL("**/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });
});

// ─── 로그인 투표 ─────────────────────────────────────────────────

test.describe("로그인 투표", () => {
  test.skip(true, "Supabase 테스트 계정 필요");

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test("좋아요 클릭 → 좋아요 카운트 +1", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    const likeButton = page.getByRole("button", { name: /좋아요/ });
    const initialText = await likeButton.textContent();
    const initialCount = parseInt(initialText?.match(/\d+/)?.[0] ?? "0", 10);

    await likeButton.click();

    await expect(likeButton).toContainText(String(initialCount + 1));
  });

  test("좋아요 다시 클릭(토글) → 카운트 -1", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    const likeButton = page.getByRole("button", { name: /좋아요/ });
    const initialText = await likeButton.textContent();
    const initialCount = parseInt(initialText?.match(/\d+/)?.[0] ?? "0", 10);

    // 좋아요 클릭
    await likeButton.click();
    await expect(likeButton).toContainText(String(initialCount + 1));

    // 다시 클릭하여 토글
    await likeButton.click();
    await expect(likeButton).toContainText(String(initialCount));
  });

  test("좋아요 후 싫어요 클릭(전환) → 좋아요 -1, 싫어요 +1", async ({
    page,
  }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    const likeButton = page.getByRole("button", { name: /좋아요/ });
    const dislikeButton = page.getByRole("button", { name: /싫어요/ });

    const likeText = await likeButton.textContent();
    const dislikeText = await dislikeButton.textContent();
    const likeCount = parseInt(likeText?.match(/\d+/)?.[0] ?? "0", 10);
    const dislikeCount = parseInt(dislikeText?.match(/\d+/)?.[0] ?? "0", 10);

    // 좋아요 클릭
    await likeButton.click();
    await expect(likeButton).toContainText(String(likeCount + 1));

    // 싫어요로 전환
    await dislikeButton.click();
    await expect(likeButton).toContainText(String(likeCount));
    await expect(dislikeButton).toContainText(String(dislikeCount + 1));
  });

  test("싫어요 후 좋아요 클릭(전환) → 싫어요 -1, 좋아요 +1", async ({
    page,
  }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    const likeButton = page.getByRole("button", { name: /좋아요/ });
    const dislikeButton = page.getByRole("button", { name: /싫어요/ });

    const likeText = await likeButton.textContent();
    const dislikeText = await dislikeButton.textContent();
    const likeCount = parseInt(likeText?.match(/\d+/)?.[0] ?? "0", 10);
    const dislikeCount = parseInt(dislikeText?.match(/\d+/)?.[0] ?? "0", 10);

    // 싫어요 클릭
    await dislikeButton.click();
    await expect(dislikeButton).toContainText(String(dislikeCount + 1));

    // 좋아요로 전환
    await likeButton.click();
    await expect(dislikeButton).toContainText(String(dislikeCount));
    await expect(likeButton).toContainText(String(likeCount + 1));
  });

  test("투표 중 버튼 disabled", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    const likeButton = page.getByRole("button", { name: /좋아요/ });
    await likeButton.click();

    // 클릭 직후 버튼이 disabled 상태인지 확인
    await expect(likeButton).toBeDisabled();
  });

  test("새로고침 후 투표 상태 유지", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    const likeButton = page.getByRole("button", { name: /좋아요/ });

    // 좋아요 클릭
    await likeButton.click();
    const afterClickText = await likeButton.textContent();

    // 새로고침
    await page.reload();
    await page.waitForLoadState("networkidle");

    const afterReloadButton = page.getByRole("button", { name: /좋아요/ });
    await expect(afterReloadButton).toContainText(
      afterClickText?.match(/\d+/)?.[0] ?? ""
    );
  });

  test("투표 후 홈으로 이동하면 카드 카운트 반영", async ({ page }) => {
    await page.goto("/cities/jeju");
    await page.waitForLoadState("networkidle");

    const likeButton = page.getByRole("button", { name: /좋아요/ });
    await likeButton.click();
    const votedText = await likeButton.textContent();
    const votedCount = votedText?.match(/\d+/)?.[0] ?? "0";

    // 홈으로 이동
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 제주 카드의 좋아요 카운트가 반영되었는지 확인
    const jejuCard = page.locator('[href="/cities/jeju"]').first();
    await expect(jejuCard).toContainText(votedCount);
  });
});
