export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">이용약관</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">제1조 (목적)</h2>
          <p>
            이 약관은 K-Nomad(이하 &quot;서비스&quot;)가 제공하는 디지털 노마드 도시 정보 서비스의
            이용과 관련하여 서비스와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">제2조 (서비스의 제공)</h2>
          <p>
            서비스는 한국 내 원격근무 도시에 대한 정보 제공, 사용자 리뷰 및 평가,
            도시 비교, 워케이션 프로그램 안내 등의 기능을 제공합니다.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">제3조 (회원가입 및 탈퇴)</h2>
          <p>
            이용자는 이메일 주소를 통해 회원가입할 수 있으며,
            언제든지 회원 탈퇴를 요청할 수 있습니다.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">제4조 (리뷰 작성)</h2>
          <p>
            회원은 실제 방문 경험을 바탕으로 리뷰를 작성할 수 있으며,
            허위, 비방, 광고 목적의 리뷰는 사전 통보 없이 삭제될 수 있습니다.
          </p>
        </section>
      </div>
    </main>
  );
}
