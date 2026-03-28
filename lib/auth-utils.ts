import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, nickname: true, name: true, email: true, tier: true },
  });

  return dbUser;
}

export function getUserTier(user: { tier?: string } | null): "anonymous" | "free" | "premium" {
  if (!user) return "anonymous";
  return (user.tier as "free" | "premium") ?? "free";
}
