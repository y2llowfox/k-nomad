vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
      },
    })
  ),
}));

vi.mock("@/lib/db", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

import { getUserTier, getCurrentUser } from "@/lib/auth-utils";

describe("getUserTier", () => {
  it("returns 'anonymous' when user is null", () => {
    expect(getUserTier(null)).toBe("anonymous");
  });

  it("returns 'premium' when user.tier is 'premium'", () => {
    expect(getUserTier({ tier: "premium" })).toBe("premium");
  });

  it("returns 'free' when user.tier is 'free'", () => {
    expect(getUserTier({ tier: "free" })).toBe("free");
  });

  it("returns 'free' when user has no tier property", () => {
    expect(getUserTier({})).toBe("free");
  });
});

describe("getCurrentUser", () => {
  it("returns null when supabase user is null", async () => {
    const result = await getCurrentUser();
    expect(result).toBeNull();
  });
});
