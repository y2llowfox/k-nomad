import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CityNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="text-center">
        <p className="text-5xl mb-4">🏝️</p>
        <h2 className="text-xl font-bold mb-2">도시를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-6">
          요청하신 도시 정보가 존재하지 않습니다.
        </p>
        <Link href="/">
          <Button>🏠 홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
}
