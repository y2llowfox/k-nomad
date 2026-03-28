import { CostItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CostTabProps {
  costs: CostItem[];
  monthlyCost: number;
}

export default function CostTab({ costs, monthlyCost }: CostTabProps) {
  const maxAmount = Math.max(...costs.map((c) => c.amount));

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">월 생활비 내역</CardTitle>
          <p className="text-sm text-muted-foreground">
            노마드 기준 1인 예상 월 생활비
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {costs.map((item) => {
            const percentage = (item.amount / maxAmount) * 100;
            return (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">
                    {item.amount}
                    {item.unit}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-blue-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="pt-4 mt-4 border-t flex items-center justify-between">
            <span className="font-semibold">총 예상 생활비</span>
            <span className="text-xl font-bold text-primary">
              {monthlyCost}만원/월
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
