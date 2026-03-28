import { MonthlyWeather } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeatherTabProps {
  weather: MonthlyWeather[];
  cityName: string;
}

const MONTH_LABELS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

function getTempColor(temp: number): string {
  if (temp >= 28) return "bg-red-500";
  if (temp >= 22) return "bg-orange-400";
  if (temp >= 15) return "bg-yellow-400";
  if (temp >= 5) return "bg-blue-300";
  return "bg-blue-500";
}

export default function WeatherTab({ weather, cityName }: WeatherTabProps) {
  const maxTemp = Math.max(...weather.map((w) => w.avgTemp));
  const minTemp = Math.min(...weather.map((w) => w.avgTemp));
  const maxRain = Math.max(...weather.map((w) => w.rainfall));

  return (
    <div className="space-y-6">
      {/* Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">월별 평균 기온</CardTitle>
          <p className="text-sm text-muted-foreground">
            {cityName}의 연간 기온 변화 (최저 {minTemp}°C ~ 최고 {maxTemp}°C)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-48">
            {weather.map((w) => {
              const range = maxTemp - minTemp || 1;
              const height = ((w.avgTemp - minTemp + 5) / (range + 10)) * 100;
              return (
                <div
                  key={w.month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs font-medium">{w.avgTemp}°</span>
                  <div
                    className={`w-full rounded-t-md ${getTempColor(w.avgTemp)}`}
                    style={{ height: `${Math.max(height, 10)}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {MONTH_LABELS[w.month - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rainfall Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">월별 강수량</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {weather.map((w) => {
              const height = maxRain > 0 ? (w.rainfall / maxRain) * 100 : 0;
              return (
                <div
                  key={w.month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs font-medium">{w.rainfall}mm</span>
                  <div
                    className="w-full rounded-t-md bg-sky-400"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {MONTH_LABELS[w.month - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Humidity Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">월별 습도</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {weather.map((w) => (
              <div
                key={w.month}
                className="text-center p-2 rounded-lg bg-muted/50"
              >
                <p className="text-xs text-muted-foreground">
                  {MONTH_LABELS[w.month - 1]}
                </p>
                <p className="text-sm font-semibold">{w.humidity}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
