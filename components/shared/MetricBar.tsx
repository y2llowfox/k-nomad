import { getScoreColor, getScoreLabel } from "@/lib/utils";

interface MetricBarProps {
  label: string;
  emoji: string;
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export default function MetricBar({
  label,
  emoji,
  score,
  showLabel = true,
  size = "md",
}: MetricBarProps) {
  const percentage = (score / 5) * 100;
  const colorClass = getScoreColor(score);
  const height = size === "sm" ? "h-2" : "h-3";

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <span className="text-sm whitespace-nowrap min-w-[100px]">
          {emoji} {label}
        </span>
      )}
      <div className={`flex-1 ${height} bg-muted rounded-full overflow-hidden`}>
        <div
          className={`${height} ${colorClass} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium min-w-[60px] text-right">
        {getScoreLabel(score)}
      </span>
    </div>
  );
}
