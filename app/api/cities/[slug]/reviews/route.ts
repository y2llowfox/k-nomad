import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const { slug } = await params;

  const city = await prisma.city.findUnique({ where: { slug } });
  if (!city) {
    return NextResponse.json(
      { error: "도시를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const body = await request.json();
  const {
    duration,
    visitPeriod,
    profession,
    scores,
    oneLiner,
    detailReview,
    recommendation,
  } = body;

  // Calculate overall score from individual scores
  const scoreValues = Object.values(scores) as number[];
  const overallScore =
    scoreValues.length > 0
      ? Math.round(
          (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) * 10
        ) / 10
      : 3.0;

  const reviewText = [oneLiner, detailReview].filter(Boolean).join("\n\n");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { nickname: true, name: true },
  });

  const review = await prisma.review.create({
    data: {
      citySlug: slug,
      authorId: session.user.id,
      authorNickname: user?.nickname || user?.name || "익명",
      visitPeriod,
      duration,
      profession,
      overallScore,
      text: reviewText,
      recommendation,
    },
  });

  // Update city review count
  await prisma.city.update({
    where: { slug },
    data: { reviewCount: { increment: 1 } },
  });

  // Update city overall score (recalculate average)
  const allReviews = await prisma.review.findMany({
    where: { citySlug: slug },
    select: { overallScore: true },
  });
  const avgScore =
    allReviews.reduce((sum, r) => sum + r.overallScore, 0) / allReviews.length;
  await prisma.city.update({
    where: { slug },
    data: { overallScore: Math.round(avgScore * 10) / 10 },
  });

  return NextResponse.json({ id: review.id }, { status: 201 });
}
