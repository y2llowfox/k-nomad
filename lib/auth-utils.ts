import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export function getUserTier(user: { tier?: string } | null): "anonymous" | "free" | "premium" {
  if (!user) return "anonymous";
  return (user.tier as "free" | "premium") ?? "free";
}
