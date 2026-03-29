import { Page } from "@playwright/test";

// E2E 테스트 전용 계정 (Supabase에 사전 등록 필요)
export const TEST_USER = {
  email: "e2e-test@knomad.kr",
  password: "testpass123",
  nickname: "e2e테스터",
};

/**
 * 테스트 계정으로 로그인
 */
export async function loginAsTestUser(page: Page) {
  await page.goto("/login");
  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL("/");
}
