"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { City } from "@/lib/types";

interface CityDetailProps {
  city: City;
}

export default function CityDetail({ city }: CityDetailProps) {
  const [likes, setLikes] = useState(city.likes);
  const [dislikes, setDislikes] = useState(city.dislikes);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch(`/api/cities/${city.slug}/vote`)
      .then((res) => res.json())
      .then((data) => {
        if (data.vote) setUserVote(data.vote);
      })
      .catch(() => {});
  }, [city.slug]);

  async function handleVote(type: "like" | "dislike") {
    if (pending) return;
    setPending(true);

    // Optimistic UI: 클릭 즉시 상태 업데이트
    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevVote = userVote;

    if (userVote === type) {
      // 같은 버튼 재클릭 → 토글 해제
      if (type === "like") setLikes((v) => v - 1);
      else setDislikes((v) => v - 1);
      setUserVote(null);
    } else if (userVote) {
      // 다른 버튼 → 전환
      if (type === "like") {
        setLikes((v) => v + 1);
        setDislikes((v) => v - 1);
      } else {
        setLikes((v) => v - 1);
        setDislikes((v) => v + 1);
      }
      setUserVote(type);
    } else {
      // 새 투표
      if (type === "like") setLikes((v) => v + 1);
      else setDislikes((v) => v + 1);
      setUserVote(type);
    }

    // API 호출 (백그라운드)
    try {
      const res = await fetch(`/api/cities/${city.slug}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (res.status === 401) {
        // 미인증 → 원복 후 로그인 이동
        setLikes(prevLikes);
        setDislikes(prevDislikes);
        setUserVote(prevVote);
        window.location.href = "/login";
      } else if (!res.ok) {
        // API 에러 → 원복
        setLikes(prevLikes);
        setDislikes(prevDislikes);
        setUserVote(prevVote);
      }
    } catch {
      // 네트워크 에러 → 원복
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setUserVote(prevVote);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        ← 목록으로
      </Link>

      {/* Hero Image */}
      <div
        className="w-full h-48 sm:h-64 md:h-80 rounded-lg bg-cover bg-center relative"
        style={{ backgroundImage: `url(${city.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold">{city.name}</h1>
          <p className="text-sm opacity-80">{city.nameEn}</p>
        </div>
      </div>

      {/* Info Grid 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">💰 예산</p>
          <p className="text-lg font-semibold">{city.monthlyCost}만원/월</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">📍 지역</p>
          <p className="text-lg font-semibold">{city.region}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">🌿 환경</p>
          <p className="text-lg font-semibold">{city.environment.join(", ") || "-"}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">🌸 최고의 계절</p>
          <p className="text-lg font-semibold">{city.bestSeason.join(", ") || "-"}</p>
        </div>
      </div>

      {/* Like / Dislike Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant={userVote === "like" ? "default" : "outline"}
          size="lg"
          disabled={pending}
          onClick={() => handleVote("like")}
        >
          👍 좋아요 {likes}
        </Button>
        <Button
          variant={userVote === "dislike" ? "destructive" : "outline"}
          size="lg"
          disabled={pending}
          onClick={() => handleVote("dislike")}
        >
          👎 싫어요 {dislikes}
        </Button>
      </div>

      {/* Description */}
      <div className="mt-6 border-t pt-6">
        <p className="text-muted-foreground leading-relaxed">{city.description}</p>
      </div>
    </div>
  );
}
