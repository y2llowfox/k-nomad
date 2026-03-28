import { ProConTag } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProsConsTabProps {
  pros: ProConTag[];
  cons: ProConTag[];
}

export default function ProsConsTab({ pros, cons }: ProsConsTabProps) {
  const sortedPros = [...pros].sort((a, b) => b.votes - a.votes);
  const sortedCons = [...cons].sort((a, b) => b.votes - a.votes);
  const maxVotes = Math.max(
    ...pros.map((p) => p.votes),
    ...cons.map((c) => c.votes),
    1
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-emerald-600">👍 장점</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedPros.map((tag) => (
            <TagBar
              key={tag.id}
              emoji={tag.emoji}
              text={tag.text}
              votes={tag.votes}
              maxVotes={maxVotes}
              type="pro"
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-red-600">👎 단점</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedCons.map((tag) => (
            <TagBar
              key={tag.id}
              emoji={tag.emoji}
              text={tag.text}
              votes={tag.votes}
              maxVotes={maxVotes}
              type="con"
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function TagBar({
  emoji,
  text,
  votes,
  maxVotes,
  type,
}: {
  emoji: string;
  text: string;
  votes: number;
  maxVotes: number;
  type: "pro" | "con";
}) {
  const percentage = (votes / maxVotes) * 100;
  const barColor =
    type === "pro"
      ? "bg-emerald-500/20 dark:bg-emerald-500/30"
      : "bg-red-500/20 dark:bg-red-500/30";
  const textColor =
    type === "pro"
      ? "text-emerald-700 dark:text-emerald-400"
      : "text-red-700 dark:text-red-400";

  return (
    <div className="relative">
      <div
        className={`absolute inset-y-0 left-0 rounded-lg ${barColor}`}
        style={{ width: `${percentage}%` }}
      />
      <div className="relative flex items-center justify-between px-3 py-2">
        <span className="text-sm font-medium">
          {emoji} {text}
        </span>
        <span className={`text-sm font-bold ${textColor}`}>+{votes}</span>
      </div>
    </div>
  );
}
