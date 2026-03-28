export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">개인정보처리방침</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. 수집하는 개인정보</h2>
          <p>
            K-Nomad는 회원가입 시 이메일 주소, 닉네임을 수집합니다.
            리뷰 작성 시 직업, 체류 기간 등의 정보를 추가로 수집할 수 있습니다.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">2. 개인정보의 이용 목적</h2>
          <p>
            수집된 개인정보는 서비스 제공, 회원 관리, 리뷰 작성자 식별,
            서비스 개선을 위한 통계 분석에 활용됩니다.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">3. 개인정보의 보유 및 파기</h2>
          <p>
            회원 탈퇴 시 개인정보는 즉시 파기됩니다.
            단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관됩니다.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">4. 개인정보의 제3자 제공</h2>
          <p>
            K-Nomad는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
          </p>
        </section>
      </div>
    </main>
  );
}
