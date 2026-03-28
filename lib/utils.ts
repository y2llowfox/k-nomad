import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 4.5) return "bg-emerald-500";
  if (score >= 3.5) return "bg-green-500";
  if (score >= 2.5) return "bg-yellow-500";
  if (score >= 1.5) return "bg-orange-500";
  return "bg-red-500";
}

export function getScoreTextColor(score: number): string {
  if (score >= 4.5) return "text-emerald-600";
  if (score >= 3.5) return "text-green-600";
  if (score >= 2.5) return "text-yellow-600";
  if (score >= 1.5) return "text-orange-600";
  return "text-red-600";
}

export function getScoreLabel(score: number): string {
  if (score >= 4.5) return "매우좋음";
  if (score >= 3.5) return "좋음";
  if (score >= 2.5) return "보통";
  if (score >= 1.5) return "아쉬움";
  return "나쁨";
}

export function formatCost(amount: number): string {
  if (amount >= 10000) {
    return `₩${Math.round(amount / 10000)}만`;
  }
  return `₩${amount.toLocaleString()}`;
}
