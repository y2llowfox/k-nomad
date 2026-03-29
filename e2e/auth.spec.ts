import { test, expect } from "@playwright/test";

// ─── 로그인 페이지 ────────────────────────────────────────────────

test.describe("로그인 페이지", () => {
  test("이메일, 비밀번호 입력 필드와 로그인 버튼이 표시된다", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    const form = page.locator("form");
    await expect(form.locator('input[type="email"]')).toBeVisible();
    await expect(form.locator('input[type="password"]')).toBeVisible();
    await expect(
      form.getByRole("button", { name: "로그인" })
    ).toBeVisible();
  });

  test("잘못된 자격증명 제출 시 에러 메시지가 표시된다", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    const form = page.locator("form");
    await form.locator('input[type="email"]').fill("wrong@test.com");
    await form.locator('input[type="password"]').fill("wrongpass123");
    await form.getByRole("button", { name: "로그인" }).click();

    // The error message ends with a period in the component
    await expect(
      page.getByText("이메일 또는 비밀번호가 올바르지 않습니다")
    ).toBeVisible({ timeout: 10000 });
  });

  test("로그인 버튼 클릭 후 로딩 상태가 된다", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Intercept the Supabase auth request and delay it to catch the loading state
    await page.route("**/auth/v1/token*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "invalid_grant", error_description: "Invalid login credentials" }),
      });
    });

    const form = page.locator("form");
    await form.locator('input[type="email"]').fill("loading@test.com");
    await form.locator('input[type="password"]').fill("loadingpass");

    const submitButton = form.getByRole("button", { name: "로그인" });
    await submitButton.click();

    // The button should be disabled during loading
    await expect(submitButton).toBeDisabled();
  });

  test("회원가입 링크 클릭 시 /register로 이동한다", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Scope to main content area to avoid matching header "회원가입" button
    await page.locator("form ~ div").getByRole("link", { name: "회원가입" }).click();
    await expect(page).toHaveURL(/\/register/);
  });
});

// ─── 회원가입 페이지 ──────────────────────────────────────────────

test.describe("회원가입 페이지", () => {
  test("닉네임, 이메일, 비밀번호, 비밀번호 확인 입력 필드와 회원가입 버튼이 표시된다", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    // Nickname input has id="nickname" but no type attribute
    await expect(page.locator("#nickname")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').nth(1)).toBeVisible();
    // The submit button text is "무료로 시작하기", not "회원가입"
    await expect(
      page.getByRole("button", { name: "무료로 시작하기" })
    ).toBeVisible();
  });

  test("email 쿼리 파라미터로 이메일 필드가 자동 채워진다", async ({
    page,
  }) => {
    await page.goto("/register?email=hello@test.com");
    await page.waitForLoadState("networkidle");

    // The email is set via useEffect after searchParams loads (async inside Suspense)
    await expect(page.locator('input[type="email"]')).toHaveValue(
      "hello@test.com",
      { timeout: 5000 }
    );
  });

  test("비밀번호 불일치 시 에러 메시지가 표시된다", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    await page.locator("#nickname").fill("테스트유저");
    await page.locator('input[type="email"]').fill("mismatch@test.com");
    await page.locator('input[type="password"]').first().fill("abcdef");
    await page.locator('input[type="password"]').nth(1).fill("abcxyz");
    await page.getByRole("button", { name: "무료로 시작하기" }).click();

    await expect(
      page.getByText("비밀번호가 일치하지 않습니다")
    ).toBeVisible();
  });

  test("비밀번호 6자 미만 시 에러 메시지가 표시된다", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    await page.locator("#nickname").fill("테스트유저");
    await page.locator('input[type="email"]').fill("short@test.com");
    await page.locator('input[type="password"]').first().fill("abcde");
    await page.locator('input[type="password"]').nth(1).fill("abcde");
    await page.getByRole("button", { name: "무료로 시작하기" }).click();

    await expect(
      page.getByText("비밀번호는 6자 이상이어야 합니다")
    ).toBeVisible();
  });
});

// ─── 헤더 Auth 상태 ──────────────────────────────────────────────

test.describe("헤더 Auth 상태", () => {
  test("비로그인 시 헤더에 로그인, 회원가입 링크가 표시된다", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const header = page.locator("header");
    const loginLink = header.getByRole("link", { name: "로그인" });
    const registerLink = header.getByRole("link", { name: "회원가입" });

    await expect(loginLink).toBeVisible();
    await expect(registerLink).toBeVisible();
  });

  test("로그인 링크는 /login, 회원가입 링크는 /register로 이동한다", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const header = page.locator("header");

    // 로그인 링크 테스트
    const loginLink = header.getByRole("link", { name: "로그인" });
    await expect(loginLink).toHaveAttribute("href", "/login");

    // 회원가입 링크 테스트
    const registerLink = header.getByRole("link", { name: "회원가입" });
    await expect(registerLink).toHaveAttribute("href", "/register");

    // 실제 네비게이션 확인 - 로그인
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);

    // 뒤로 가서 회원가입 링크 확인
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("header").getByRole("link", { name: "회원가입" }).click();
    await expect(page).toHaveURL(/\/register/);
  });
});
