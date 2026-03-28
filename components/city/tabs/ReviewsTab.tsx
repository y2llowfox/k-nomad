"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Review } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getScoreColor } from "@/lib/utils";

interface ReviewsTabProps {
  reviews: Review[];
  citySlug: string;
  userTier?: "anonymous" | "free" | "premium";
}

type SortKey = "recent" | "helpful";

const ANONYMOUS_REVIEW_LIMIT = 3;

export default function ReviewsTab({ reviews, citySlug, userTier = "anonymous" }: ReviewsTabProps) {
  const [sort, setSort] = useState<SortKey>("helpful");
  const [localReviews, setLocalReviews] = useState(reviews);

  const sorted = [...localReviews].sort((a, b) => {
    if (sort === "recent") return b.createdAt.localeCompare(a.createdAt);
    return b.helpful - a.helpful;
  });

  const isLimited = userTier === "anonymous" && sorted.length > ANONYMOUS_REVIEW_LIMIT;
  const visibleReviews = isLimited ? sorted.slice(0, ANONYMOUS_REVIEW_LIMIT) : sorted;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed rounded-lg">
        <p className="text-4xl mb-4">📝</p>
        <p className="text-lg font-medium text-muted-foreground">
          아직 리뷰가 없습니다
        </p>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          첫 번째 리뷰를 작성해 보세요!
        </p>
        <Link href={`/review/${citySlug}`}>
          <Button>리뷰 작성하기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총 {localReviews.length}개의 리뷰
        </p>
        <div className="flex gap-1">
          <Button
            variant={sort === "helpful" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSort("helpful")}
          >
            추천순
          </Button>
          <Button
            variant={sort === "recent" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSort("recent")}
          >
            최신순
          </Button>
        </div>
      </div>

      {visibleReviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onVoteUpdate={(id, type, delta) => {
            setLocalReviews((prev) =>
              prev.map((r) =>
                r.id === id ? { ...r, [type]: r[type] + delta } : r
              )
            );
          }}
        />
      ))}

      {isLimited && (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            {sorted.length - ANONYMOUS_REVIEW_LIMIT}개의 리뷰가 더 있습니다
          </p>
          <Link href="/login">
            <Button variant="outline" size="sm">
              로그인하고 모든 리뷰 보기
            </Button>
          </Link>
        </div>
      )}

      <div className="text-center pt-4">
        <Link href={userTier === "anonymous" ? "/login" : `/review/${citySlug}`}>
          <Button variant="outline">리뷰 작성하기</Button>
        </Link>
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  onVoteUpdate,
}: {
  review: Review;
  onVoteUpdate: (id: string, type: "helpful" | "unhelpful", delta: number) => void;
}) {
  const { data: session } = useSession();
  const [voting, setVoting] = useState(false);

  async function handleVote(type: "helpful" | "unhelpful") {
    if (!session) return;
    if (voting) return;
    setVoting(true);

    try {
      const res = await fetch(`/api/reviews/${review.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.action === "added") {
          onVoteUpdate(review.id, type, 1);
        } else if (data.action === "removed") {
          onVoteUpdate(review.id, type, -1);
        } else if (data.action === "changed") {
          const otherType = type === "helpful" ? "unhelpful" : "helpful";
          onVoteUpdate(review.id, type, 1);
          onVoteUpdate(review.id, otherType, -1);
        }
      }
    } finally {
      setVoting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
              👤
            </div>
            <div>
              <p className="text-sm font-medium">{review.authorNickname}</p>
              <p className="text-xs text-muted-foreground">
                {review.profession} · {review.duration} · {review.visitPeriod}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${getScoreColor(review.overallScore)} text-white border-0`}
            >
              {review.overallScore.toFixed(1)}
            </Badge>
            <RecommendBadge value={review.recommendation} />
          </div>
        </div>

        <p className="text-sm leading-relaxed">{review.text}</p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{review.createdAt}</span>
          {session ? (
            <>
              <button
                onClick={() => handleVote("helpful")}
                disabled={voting}
                className="hover:text-foreground transition-colors"
              >
                👍 {review.helpful}
              </button>
              <button
                onClick={() => handleVote("unhelpful")}
                disabled={voting}
                className="hover:text-foreground transition-colors"
              >
                👎 {review.unhelpful}
              </button>
            </>
          ) : (
            <>
              <span>👍 {review.helpful}</span>
              <span>👎 {review.unhelpful}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendBadge({ value }: { value: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    추천: { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300" },
    보통: { bg: "bg-yellow-100 dark:bg-yellow-900/40", text: "text-yellow-700 dark:text-yellow-300" },
    비추천: { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-300" },
  };
  const c = config[value] ?? config["보통"];
  return (
    <span className={`${c.bg} ${c.text} text-xs px-2 py-0.5 rounded-full font-medium`}>
      {value}
    </span>
  );
}
