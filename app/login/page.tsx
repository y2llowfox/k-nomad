"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/knomad-login/1200/900')] bg-cover bg-center opacity-20" />
        <div className="relative flex flex-col justify-center px-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-4xl">🌏</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              #1 한국 노마드 커뮤니티
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            대한민국에서
            <br />
            원격근무하기 좋은 도시
          </h1>
          <p className="text-lg text-white/70 mb-8">
            30개 도시의 생활비, 인터넷 속도, 코워킹, 안전 등
            <br />
            12개 지표를 비교하고 실사용자 리뷰를 확인하세요.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span>✅ 30개 도시 데이터</span>
            <span>✅ 실사용자 리뷰</span>
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
            <h2 className="text-2xl font-bold">로그인</h2>
            <p className="text-sm text-muted-foreground mt-1">
              K-Nomad 계정으로 로그인하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              아직 계정이 없으신가요?{" "}
              <Link href="/register" className="text-red-500 font-medium hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
