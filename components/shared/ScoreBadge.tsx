import { Badge } from "@/components/ui/badge";
import { getScoreColor } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const colorClass = getScoreColor(score);
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <Badge
      className={`${colorClass} text-white border-0 ${sizeClasses[size]}`}
    >
      ⭐ {score.toFixed(1)}
    </Badge>
  );
}
