"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Hero() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = email ? `?email=${encodeURIComponent(email)}` : "";
    router.push(`/signup${params}`);
  }

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/knomad-hero/1920/600')] bg-cover bg-center opacity-20" />
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🌏</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              #1 한국 노마드 커뮤니티
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            대한민국에서
            <br />
            원격근무하기 좋은 도시
          </h1>
          <p className="text-lg text-white/80 mb-6">
            30개 도시의 생활비, 인터넷 속도, 코워킹, 안전 등
            <br className="hidden md:block" />
            12개 지표를 비교하고 실사용자 리뷰를 확인하세요.
          </p>
          <div className="flex items-center gap-4 mb-6 text-sm text-white/70">
            <span>✅ 30개 도시 데이터</span>
            <span>✅ 실사용자 리뷰</span>
            <span>✅ 실시간 업데이트</span>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button type="submit" className="bg-red-500 hover:bg-red-600 whitespace-nowrap">
              무료로 시작하기 →
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
