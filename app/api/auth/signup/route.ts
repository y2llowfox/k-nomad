import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const { nickname, email, password } = await request.json();

  if (!email || !password || !nickname) {
    return NextResponse.json(
      { error: "모든 필드를 입력해주세요." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "비밀번호는 6자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json(
      { error: "이미 사용 중인 이메일입니다." },
      { status: 409 }
    );
  }

  const existingNickname = await prisma.user.findUnique({ where: { nickname } });
  if (existingNickname) {
    return NextResponse.json(
      { error: "이미 사용 중인 닉네임입니다." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      nickname,
      name: nickname,
      password: hashedPassword,
      tier: "free",
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
