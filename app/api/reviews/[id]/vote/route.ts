import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const { id: reviewId } = await params;
  const { type } = await request.json();

  if (type !== "helpful" && type !== "unhelpful") {
    return NextResponse.json(
      { error: "type은 helpful 또는 unhelpful이어야 합니다." },
      { status: 400 }
    );
  }

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    return NextResponse.json(
      { error: "리뷰를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // Check existing vote
  const existingVote = await prisma.reviewVote.findUnique({
    where: { reviewId_userId: { reviewId, userId: session.user.id } },
  });

  if (existingVote) {
    if (existingVote.type === type) {
      // Remove vote (toggle off)
      await prisma.reviewVote.delete({
        where: { id: existingVote.id },
      });
      await prisma.review.update({
        where: { id: reviewId },
        data: { [type]: { decrement: 1 } },
      });
      return NextResponse.json({ action: "removed", type });
    } else {
      // Change vote type
      await prisma.reviewVote.update({
        where: { id: existingVote.id },
        data: { type },
      });
      await prisma.review.update({
        where: { id: reviewId },
        data: {
          [existingVote.type]: { decrement: 1 },
          [type]: { increment: 1 },
        },
      });
      return NextResponse.json({ action: "changed", type });
    }
  }

  // Create new vote
  await prisma.reviewVote.create({
    data: { reviewId, userId: session.user.id, type },
  });
  await prisma.review.update({
    where: { id: reviewId },
    data: { [type]: { increment: 1 } },
  });

  return NextResponse.json({ action: "added", type });
}
