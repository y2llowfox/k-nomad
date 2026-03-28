"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setForm((prev) => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { nickname: form.nickname },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.user.id,
          email: form.email,
          nickname: form.nickname,
        }),
      });

      if (!res.ok) {
        const resData = await res.json();
        setError(resData.error || "프로필 생성에 실패했습니다.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/knomad-register/1200/900')] bg-cover bg-center opacity-20" />
        <div className="relative flex flex-col justify-center px-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-4xl">🌏</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              #1 한국 노마드 커뮤니티
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            무료로 가입하고
            <br />
            모든 기능을 이용하세요
          </h1>
          <p className="text-lg text-white/70 mb-8">
            도시 리뷰 작성, 도시 비교, 투표 등
            <br />
            회원만의 기능을 경험해보세요.
          </p>
          <div className="space-y-3 text-sm text-white/60">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center text-xs">✓</span>
              <span>모든 리뷰 무제한 열람</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center text-xs">✓</span>
              <span>도시 리뷰 작성 및 평가</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center text-xs">✓</span>
              <span>최대 3개 도시 비교</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center text-xs">✓</span>
              <span>리뷰 도움됐어요 투표</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-2xl">🏠</span>
              <span className="font-bold text-xl">K-Nomad</span>
            </Link>
            <h2 className="text-2xl font-bold">회원가입</h2>
            <p className="text-sm text-muted-foreground mt-1">
              K-Nomad에 가입하고 리뷰를 작성하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                placeholder="노마드 닉네임"
                value={form.nickname}
                onChange={(e) => update("nickname", e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="6자 이상"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={form.passwordConfirm}
                onChange={(e) => update("passwordConfirm", e.target.value)}
                className="h-11"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center bg-red-50 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              {loading ? "가입 중..." : "무료로 시작하기"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-red-500 font-medium hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
