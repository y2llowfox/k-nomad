import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const { id, email, nickname } = await request.json();

  if (!id || !email || !nickname) {
    return NextResponse.json(
      { error: "모든 필드를 입력해주세요." },
      { status: 400 }
    );
  }

  const existingNickname = await prisma.user.findUnique({ where: { nickname } });
  if (existingNickname && existingNickname.id !== id) {
    return NextResponse.json(
      { error: "이미 사용 중인 닉네임입니다." },
      { status: 409 }
    );
  }

  await prisma.user.upsert({
    where: { id },
    update: { nickname, name: nickname, email },
    create: {
      id,
      email,
      nickname,
      name: nickname,
      tier: "free",
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
