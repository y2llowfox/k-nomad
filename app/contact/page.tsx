import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">문의하기</h1>
      <p className="text-muted-foreground mb-8">
        K-Nomad에 대한 문의사항이 있으시면 아래 연락처로 연락해주세요
      </p>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📧 이메일 문의</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              일반 문의, 제안, 버그 신고 등
            </p>
            <p className="text-sm font-medium mt-1">contact@knomad.kr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">🏢 제휴/협력 문의</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              지자체 워케이션 프로그램 등록, 코워킹 스페이스 제휴, 광고 문의
            </p>
            <p className="text-sm font-medium mt-1">partner@knomad.kr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">🐛 데이터 오류 제보</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              도시 정보, 코워킹 스페이스 정보 등의 오류를 발견하셨다면 알려주세요
            </p>
            <p className="text-sm font-medium mt-1">data@knomad.kr</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
