"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { METRICS, PROFESSIONS, STAY_DURATIONS, PRO_TAGS, CON_TAGS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  cityName: string;
  citySlug: string;
}

const SCORE_EMOJIS = ["", "😡", "😐", "😊", "😍", "🤩"];
const STEP_LABELS = ["기본 정보", "항목별 평가", "장단점 태그", "텍스트 리뷰"];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

export default function ReviewForm({ cityName, citySlug }: ReviewFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [duration, setDuration] = useState("");
  const [visitYear, setVisitYear] = useState("");
  const [visitMonth, setVisitMonth] = useState("");
  const [profession, setProfession] = useState("");

  // Step 2
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(METRICS.map((m) => [m.key, 3]))
  );

  // Step 3
  const [selectedPros, setSelectedPros] = useState<Set<string>>(new Set());
  const [selectedCons, setSelectedCons] = useState<Set<string>>(new Set());

  // Step 4
  const [oneLiner, setOneLiner] = useState("");
  const [detailReview, setDetailReview] = useState("");
  const [recommendation, setRecommendation] = useState<string>("");

  function handleScoreChange(key: string, value: number[]) {
    setScores((prev) => ({ ...prev, [key]: value[0] }));
  }

  function togglePro(text: string) {
    setSelectedPros((prev) => {
      const next = new Set(prev);
      if (next.has(text)) next.delete(text);
      else next.add(text);
      return next;
    });
  }

  function toggleCon(text: string) {
    setSelectedCons((prev) => {
      const next = new Set(prev);
      if (next.has(text)) next.delete(text);
      else next.add(text);
      return next;
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/cities/${citySlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration,
          visitPeriod: `${visitYear}년 ${visitMonth}월`,
          profession,
          scores,
          pros: Array.from(selectedPros),
          cons: Array.from(selectedCons),
          oneLiner,
          detailReview,
          recommendation,
        }),
      });

      if (res.status === 401) {
        setError("로그인이 필요합니다.");
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "리뷰 등록에 실패했습니다.");
        setSubmitting(false);
        return;
      }

      setShowSuccess(true);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  function goNext() {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  }

  function goBack() {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }

  return (
    <div>
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEP_LABELS.map((label, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                idx === currentStep
                  ? "bg-primary text-primary-foreground"
                  : idx < currentStep
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {idx + 1}
            </div>
            <span
              className={cn(
                "text-sm hidden sm:inline",
                idx === currentStep
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {idx < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  "w-8 h-px",
                  idx < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: 기본 정보 */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">체류 기간</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="체류 기간을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {STAY_DURATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">방문 시기</Label>
            <div className="flex gap-3">
              <Select value={visitYear} onValueChange={setVisitYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="년도" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={visitMonth} onValueChange={setVisitMonth}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="월" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m}월
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">직업</Label>
            <Select value={profession} onValueChange={setProfession}>
              <SelectTrigger>
                <SelectValue placeholder="직업을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {PROFESSIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Step 2: 항목별 평가 */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {METRICS.map((metric) => {
            const score = scores[metric.key];
            return (
              <div key={metric.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">
                    {metric.emoji} {metric.label}
                  </Label>
                  <span className="text-lg min-w-[48px] text-right">
                    {SCORE_EMOJIS[score]}{" "}
                    <span className="text-sm font-medium">{score}</span>
                  </span>
                </div>
                <Slider
                  value={[score]}
                  onValueChange={(val) => handleScoreChange(metric.key, val)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Step 3: 장단점 태그 */}
      {currentStep === 2 && (
        <div className="space-y-8">
          <div>
            <Label className="mb-3 block text-base font-semibold">
              👍 장점 (좋았던 점)
            </Label>
            <div className="flex flex-wrap gap-2">
              {PRO_TAGS.map((tag) => {
                const isSelected = selectedPros.has(tag.text);
                return (
                  <button
                    key={tag.text}
                    type="button"
                    onClick={() => togglePro(tag.text)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors",
                      isSelected
                        ? "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-300"
                        : "bg-background border-input text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {tag.emoji} {tag.text}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="mb-3 block text-base font-semibold">
              👎 단점 (아쉬웠던 점)
            </Label>
            <div className="flex flex-wrap gap-2">
              {CON_TAGS.map((tag) => {
                const isSelected = selectedCons.has(tag.text);
                return (
                  <button
                    key={tag.text}
                    type="button"
                    onClick={() => toggleCon(tag.text)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors",
                      isSelected
                        ? "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-300"
                        : "bg-background border-input text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {tag.emoji} {tag.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: 텍스트 리뷰 */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>한줄평</Label>
              <span className="text-xs text-muted-foreground">
                {oneLiner.length}/50
              </span>
            </div>
            <Input
              value={oneLiner}
              onChange={(e) =>
                setOneLiner(e.target.value.slice(0, 50))
              }
              placeholder="이 도시를 한 문장으로 표현한다면?"
              maxLength={50}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>상세 리뷰</Label>
              <span className="text-xs text-muted-foreground">
                {detailReview.length}/2000
              </span>
            </div>
            <Textarea
              value={detailReview}
              onChange={(e) =>
                setDetailReview(e.target.value.slice(0, 2000))
              }
              placeholder="워케이션 경험을 자세히 공유해주세요..."
              rows={6}
              maxLength={2000}
            />
          </div>

          <div>
            <Label className="mb-3 block">추천 여부</Label>
            <div className="flex gap-3">
              {(["추천", "보통", "비추천"] as const).map((option) => {
                const isSelected = recommendation === option;
                const colorMap = {
                  추천: isSelected
                    ? "bg-emerald-100 border-emerald-400 text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-600 dark:text-emerald-300"
                    : "",
                  보통: isSelected
                    ? "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-600 dark:text-yellow-300"
                    : "",
                  비추천: isSelected
                    ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/40 dark:border-red-600 dark:text-red-300"
                    : "",
                };
                const emojiMap = { 추천: "👍", 보통: "🤔", 비추천: "👎" };

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRecommendation(option)}
                    className={cn(
                      "flex-1 py-3 rounded-lg border text-sm font-medium transition-colors",
                      isSelected
                        ? colorMap[option]
                        : "bg-background border-input text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {emojiMap[option]} {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={goBack}>
            이전
          </Button>
        ) : (
          <div />
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {currentStep < 3 ? (
          <Button onClick={goNext}>다음</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "제출 중..." : "제출하기"}
          </Button>
        )}
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>리뷰가 등록되었습니다!</DialogTitle>
            <DialogDescription>
              {cityName}에 대한 소중한 리뷰를 남겨주셔서 감사합니다.
              다른 노마드들에게 큰 도움이 됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => {
              setShowSuccess(false);
              router.push(`/cities/${citySlug}`);
            }}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
