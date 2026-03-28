import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      tier?: string;
      nickname?: string | null;
    };
  }

  interface User {
    tier?: string;
    nickname?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    tier?: string;
    nickname?: string | null;
  }
}
