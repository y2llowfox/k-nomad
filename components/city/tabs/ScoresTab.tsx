import { City } from "@/lib/types";
import MetricBar from "@/components/shared/MetricBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreTextColor } from "@/lib/utils";

interface ScoresTabProps {
  city: City;
}

export default function ScoresTab({ city }: ScoresTabProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">종합 점수</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <span
              className={`text-5xl font-bold ${getScoreTextColor(city.overallScore)}`}
            >
              {city.overallScore.toFixed(1)}
            </span>
            <div>
              <p className="text-sm text-muted-foreground">5.0 만점</p>
              <p className="text-sm text-muted-foreground">
                리뷰 {city.reviewCount}개 기반
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{city.description}</p>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">핵심 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="인터넷" value={`${city.internetSpeed}Mbps`} emoji="📡" />
            <InfoItem label="월 생활비" value={`${city.monthlyCost}만원`} emoji="💰" />
            <InfoItem label="현재 기온" value={`${city.currentTemp}°C`} emoji={city.weatherIcon} />
            <InfoItem label="KTX" value={city.hasKTX ? "연결됨" : "미연결"} emoji="🚆" />
            <InfoItem label="바다" value={city.isSeaside ? "근접" : "내륙"} emoji="🌊" />
            <InfoItem label="리뷰" value={`${city.reviewCount}개`} emoji="📝" />
          </div>
        </CardContent>
      </Card>

      {/* 12 Metrics */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">12개 항목별 평가</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {city.metrics.map((metric) => (
              <MetricBar
                key={metric.key}
                label={metric.label}
                emoji={metric.emoji}
                score={metric.score}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({
  label,
  value,
  emoji,
}: {
  label: string;
  value: string;
  emoji: string;
}) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
      <span className="text-lg">{emoji}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
