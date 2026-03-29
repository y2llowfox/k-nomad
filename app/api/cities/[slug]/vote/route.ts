import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { type } = await request.json();
  if (type !== "like" && type !== "dislike") {
    return NextResponse.json({ error: "잘못된 투표 타입" }, { status: 400 });
  }

  const { slug } = params;

  // User 테이블에 없으면 자동 생성 (Supabase Auth ↔ Prisma User 동기화)
  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email,
      nickname: user.user_metadata?.nickname ?? user.email?.split("@")[0],
      name: user.user_metadata?.nickname ?? user.email?.split("@")[0],
      tier: "free",
    },
  });

  const existing = await prisma.cityVote.findUnique({
    where: { userId_citySlug: { userId: user.id, citySlug: slug } },
  });

  if (existing) {
    if (existing.type === type) {
      // 같은 타입 재클릭 → 해제
      await prisma.cityVote.delete({ where: { id: existing.id } });
      await prisma.city.update({
        where: { slug },
        data: { [type === "like" ? "likes" : "dislikes"]: { decrement: 1 } },
      });
      return NextResponse.json({ action: "removed", type });
    } else {
      // 다른 타입 → 전환
      await prisma.cityVote.update({
        where: { id: existing.id },
        data: { type },
      });
      const oldField = existing.type === "like" ? "likes" : "dislikes";
      const newField = type === "like" ? "likes" : "dislikes";
      await prisma.city.update({
        where: { slug },
        data: {
          [oldField]: { decrement: 1 },
          [newField]: { increment: 1 },
        },
      });
      return NextResponse.json({ action: "switched", type });
    }
  } else {
    // 새 투표
    await prisma.cityVote.create({
      data: { userId: user.id, citySlug: slug, type },
    });
    await prisma.city.update({
      where: { slug },
      data: { [type === "like" ? "likes" : "dislikes"]: { increment: 1 } },
    });
    return NextResponse.json({ action: "created", type });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ vote: null });
  }

  const vote = await prisma.cityVote.findUnique({
    where: { userId_citySlug: { userId: user.id, citySlug: params.slug } },
  });

  return NextResponse.json({ vote: vote?.type ?? null });
}
