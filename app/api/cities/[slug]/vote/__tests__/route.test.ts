const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: { getUser: () => mockGetUser() },
    })
  ),
}));

const mockUserUpsert = vi.fn();
const mockVoteFindUnique = vi.fn();
const mockVoteCreate = vi.fn();
const mockVoteDelete = vi.fn();
const mockVoteUpdate = vi.fn();
const mockCityUpdate = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    user: { upsert: (...args: any[]) => mockUserUpsert(...args) },
    cityVote: {
      findUnique: (...args: any[]) => mockVoteFindUnique(...args),
      create: (...args: any[]) => mockVoteCreate(...args),
      delete: (...args: any[]) => mockVoteDelete(...args),
      update: (...args: any[]) => mockVoteUpdate(...args),
    },
    city: { update: (...args: any[]) => mockCityUpdate(...args) },
  },
}));

import { POST, GET } from "../route";

const TEST_USER = {
  id: "user-123",
  email: "test@example.com",
  user_metadata: { nickname: "tester" },
};

function makePostRequest(slug: string, body: any) {
  return new Request(`http://localhost/api/cities/${slug}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeGetRequest(slug: string) {
  return new Request(`http://localhost/api/cities/${slug}/vote`);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockGetUser.mockResolvedValue({ data: { user: TEST_USER } });
  mockUserUpsert.mockResolvedValue({});
  mockVoteFindUnique.mockResolvedValue(null);
  mockVoteCreate.mockResolvedValue({});
  mockVoteDelete.mockResolvedValue({});
  mockVoteUpdate.mockResolvedValue({});
  mockCityUpdate.mockResolvedValue({});
});

// ── POST ─────────────────────────────────────────────────────

describe("POST /api/cities/[slug]/vote", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await POST(makePostRequest("jeju", { type: "like" }), {
      params: { slug: "jeju" },
    });

    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid vote type", async () => {
    const res = await POST(makePostRequest("jeju", { type: "invalid" }), {
      params: { slug: "jeju" },
    });

    expect(res.status).toBe(400);
  });

  it("upserts user on authenticated request", async () => {
    await POST(makePostRequest("jeju", { type: "like" }), {
      params: { slug: "jeju" },
    });

    expect(mockUserUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: TEST_USER.id },
      })
    );
  });

  it("creates new like vote and increments likes", async () => {
    const res = await POST(makePostRequest("jeju", { type: "like" }), {
      params: { slug: "jeju" },
    });
    const body = await res.json();

    expect(mockVoteCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ type: "like", citySlug: "jeju" }),
      })
    );
    expect(mockCityUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ likes: { increment: 1 } }),
      })
    );
    expect(body).toEqual({ action: "created", type: "like" });
  });

  it("creates new dislike vote and increments dislikes", async () => {
    const res = await POST(makePostRequest("jeju", { type: "dislike" }), {
      params: { slug: "jeju" },
    });
    const body = await res.json();

    expect(mockVoteCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ type: "dislike" }),
      })
    );
    expect(mockCityUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ dislikes: { increment: 1 } }),
      })
    );
    expect(body).toEqual({ action: "created", type: "dislike" });
  });

  it("removes vote when same type is clicked again", async () => {
    mockVoteFindUnique.mockResolvedValue({ id: "vote-1", type: "like" });

    const res = await POST(makePostRequest("jeju", { type: "like" }), {
      params: { slug: "jeju" },
    });
    const body = await res.json();

    expect(mockVoteDelete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "vote-1" } })
    );
    expect(mockCityUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ likes: { decrement: 1 } }),
      })
    );
    expect(body).toEqual({ action: "removed", type: "like" });
  });

  it("switches from like to dislike", async () => {
    mockVoteFindUnique.mockResolvedValue({ id: "vote-1", type: "like" });

    const res = await POST(makePostRequest("jeju", { type: "dislike" }), {
      params: { slug: "jeju" },
    });
    const body = await res.json();

    expect(mockVoteUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "vote-1" },
        data: { type: "dislike" },
      })
    );
    expect(mockCityUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          likes: { decrement: 1 },
          dislikes: { increment: 1 },
        }),
      })
    );
    expect(body).toEqual({ action: "switched", type: "dislike" });
  });

  it("switches from dislike to like", async () => {
    mockVoteFindUnique.mockResolvedValue({ id: "vote-1", type: "dislike" });

    const res = await POST(makePostRequest("jeju", { type: "like" }), {
      params: { slug: "jeju" },
    });
    const body = await res.json();

    expect(mockVoteUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "vote-1" },
        data: { type: "like" },
      })
    );
    expect(mockCityUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          dislikes: { decrement: 1 },
          likes: { increment: 1 },
        }),
      })
    );
    expect(body).toEqual({ action: "switched", type: "like" });
  });
});

// ── GET ──────────────────────────────────────────────────────

describe("GET /api/cities/[slug]/vote", () => {
  it("returns {vote: null} when unauthenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await GET(makeGetRequest("jeju"), {
      params: { slug: "jeju" },
    });
    const body = await res.json();

    expect(body).toEqual({ vote: null });
  });

  it("returns the vote type when user has voted", async () => {
    mockVoteFindUnique.mockResolvedValue({ type: "like" });

    const res = await GET(makeGetRequest("jeju"), {
      params: { slug: "jeju" },
    });
    const body = await res.json();

    expect(body).toEqual({ vote: "like" });
  });

  it("returns {vote: null} when user has no vote", async () => {
    mockVoteFindUnique.mockResolvedValue(null);

    const res = await GET(makeGetRequest("jeju"), {
      params: { slug: "jeju" },
    });
    const body = await res.json();

    expect(body).toEqual({ vote: null });
  });

  it("responds with status 200", async () => {
    const res = await GET(makeGetRequest("jeju"), {
      params: { slug: "jeju" },
    });

    expect(res.status).toBe(200);
  });
});
