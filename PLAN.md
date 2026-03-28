# 도시 상세페이지 구현 계획

> 작성일: 2026-03-28
> 레퍼런스: NomadList Bangkok 상세페이지 (`nomads_bangkok.png`)
> 분해 전략: 레이어별 (수직) — 데이터 → 레이아웃 → 정보 → 인터랙션 → 마무리

---

## Phase 1. 데이터 & API 레이어

### 오버뷰
도시 상세페이지에 필요한 데이터를 단일 API로 제공하는 엔드포인트를 만든다. 완료되면 `/api/cities/[slug]` 호출 시 City + 모든 관계 데이터(metrics, costs, weather, photos, pros/cons, coworkings, reviews, nearby)가 JSON으로 반환된다.

### 현재 상태
- Prisma 스키마에 City 모델 + 12개 관계 테이블 정의 완료
- `/api/cities/route.ts` — 도시 리스트 API만 존재
- `lib/data/cities.ts` — 30개 도시 시드 데이터 존재
- `lib/types.ts` — City 인터페이스 정의 완료
- `/api/cities/[slug]` 엔드포인트 없음

### 수정/개선 체크리스트
- [ ] **API 라우트 생성** — `app/api/cities/[slug]/route.ts`
  - Prisma `findUnique`로 slug 기반 조회
  - `include`로 모든 관계 데이터 포함: metrics, costs, highlights, tags(pros/cons), weather, photos, coworkings, reviews(최신 10개 + author 정보), nearbyFrom → toCity
  - 404 처리: 존재하지 않는 slug일 때 `{ error: "City not found" }` 반환
- [ ] **타입 보강 (필요 시)** — `lib/types.ts`
  - `CityDetail` 타입 추가 (City 기본 + 관계 데이터 전체 포함)
  - API 응답 타입 정의
- [ ] **데이터 검증** — 시드 데이터에 관계 데이터(metrics, costs, weather 등)가 실제로 존재하는지 확인
  - 누락 시 `prisma/seed.ts`에 샘플 데이터 보강

### 검증 체크리스트
- [ ] `curl localhost:3000/api/cities/jeju` 호출 시 모든 관계 데이터 포함된 JSON 반환
- [ ] 존재하지 않는 slug 호출 시 404 응답
- [ ] 기존 `/api/cities` 리스트 API 정상 동작 확인 (회귀 테스트)

---

## Phase 2. 페이지 레이아웃 + Hero 섹션

### 오버뷰
`/cities/[slug]` 라우트와 페이지 컴포넌트를 생성한다. Hero 이미지 + 도시명 + 핵심 지표 요약 + 탭 네비게이션 골격을 구현한다. 완료되면 CityCard 클릭 시 도시 상세페이지로 이동하여 Hero 영역이 렌더링된다.

### 현재 상태 (Phase 1 완료 후)
- `/api/cities/[slug]` API 정상 동작
- CityDetail 타입 정의 완료

### 수정/개선 체크리스트
- [ ] **페이지 라우트 생성** — `app/cities/[slug]/page.tsx`
  - Server Component로 구현 (SSR)
  - Prisma 직접 호출 또는 내부 fetch로 데이터 조회
  - `generateMetadata`로 동적 SEO 메타데이터 (도시명 + 설명)
- [ ] **Hero 섹션 컴포넌트** — `components/city/Hero.tsx`
  - 도시 대표 이미지 (full-width, 높이 300~400px)
  - 이미지 위 오버레이: 도시명(한글/영문), 지역, 카테고리 뱃지
  - "← 목록으로" 뒤로가기 버튼
  - 레퍼런스: `nomads_bangkok.png` 상단 영역 참고
- [ ] **핵심 지표 요약 바** — `components/city/ScoreSummary.tsx`
  - Hero 아래 가로 배치: 종합점수, 월 생활비, 인터넷 속도, 현재 기온
  - 컬러 뱃지 형태 (점수별 초록/노랑/빨강)
- [ ] **탭 네비게이션** — `components/city/TabNav.tsx`
  - 탭 항목: 스코어, 생활비, 날씨, 장단점, 코워킹, 리뷰, 사진, 주변도시
  - 클릭 시 해당 섹션으로 스크롤 (앵커 기반)
  - sticky 상단 고정 (스크롤 시)

### 검증 체크리스트
- [ ] `/cities/jeju` 접속 시 Hero 이미지 + 도시명 + 지표 요약 렌더링
- [ ] 탭 클릭 시 해당 섹션 ID로 스크롤
- [ ] 홈페이지 CityCard 클릭 → 상세페이지 이동 정상 동작
- [ ] 뒤로가기 버튼 → 홈 이동
- [ ] 모바일에서 Hero 이미지 비율 정상

---

## Phase 3. 정보 섹션 (스코어 + 생활비 + 날씨)

### 오버뷰
도시의 정량적 데이터를 시각화하는 3개 섹션을 구현한다. 완료되면 12개 지표 스코어 바, 생활비 항목별 테이블, 12개월 날씨 차트가 표시된다.

### 현재 상태 (Phase 2 완료 후)
- `/cities/[slug]` 페이지 + Hero + 탭 네비 동작
- 데이터: metrics(12개 지표), costs(항목별), weather(12개월) 로드 완료

### 수정/개선 체크리스트
- [ ] **스코어 섹션** — `components/city/ScoreSection.tsx`
  - 12개 지표를 컬러 프로그레스바로 표시 (레퍼런스: Bangkok 페이지 좌측 스코어 바)
  - 각 지표: emoji + 라벨 + 바 + 점수(5점 만점)
  - 바 색상: 4.0↑ 초록, 3.0↑ 노랑, 2.0↑ 주황, 그 외 빨강
  - 2열 그리드 레이아웃 (모바일 1열)
- [ ] **생활비 섹션** — `components/city/CostSection.tsx`
  - 항목별 비용 테이블: 카테고리, 금액, 단위
  - 상단에 월 총 생활비 강조 표시
  - 항목 예시: 원룸, 코워킹, 식비, 카페, 교통 등
- [ ] **날씨 섹션** — `components/city/WeatherSection.tsx`
  - 12개월 기온/강수량 차트 (간단한 바 차트 또는 라인)
  - 차트 라이브러리 없이 Tailwind + div 기반 구현 (또는 recharts 사용)
  - 현재 월 하이라이트 표시
  - 습도 정보 포함

### 검증 체크리스트
- [ ] 12개 지표가 올바른 색상 바로 렌더링
- [ ] 생활비 항목 합계 ≈ monthlyCost 값과 일치
- [ ] 12개월 날씨 데이터 모두 표시
- [ ] 탭 네비에서 각 섹션 클릭 시 정확한 위치로 스크롤

---

## Phase 4. 커뮤니티 섹션 (장단점 + 리뷰 + 사진 + 코워킹)

### 오버뷰
사용자 생성 콘텐츠 및 정성적 정보를 표시하는 섹션들을 구현한다. 완료되면 장단점 태그, 리뷰 목록, 사진 갤러리, 코워킹 스페이스 카드가 표시된다.

### 현재 상태 (Phase 3 완료 후)
- 스코어/생활비/날씨 섹션 렌더링 완료
- 데이터: pros/cons(tags), reviews, photos, coworkings 로드 완료

### 수정/개선 체크리스트
- [ ] **장단점 섹션** — `components/city/ProsConsSection.tsx`
  - 장점/단점 2열 배치
  - 각 태그: emoji + 텍스트 + 투표 수
  - 장점은 초록 뱃지, 단점은 빨강 뱃지
- [ ] **리뷰 섹션** — `components/city/ReviewSection.tsx`
  - 리뷰 카드 리스트: 닉네임, 직업, 방문기간, 체류기간, 점수, 추천여부, 본문
  - 도움됨/안됨 버튼 (읽기 전용 — 인터랙션은 MVP 이후)
  - 최신순 정렬, 최대 10개 표시
- [ ] **사진 갤러리** — `components/city/PhotoGallery.tsx`
  - 그리드 레이아웃 (3열, 모바일 2열)
  - 클릭 시 라이트박스 (shadcn Dialog 활용)
- [ ] **코워킹 스페이스** — `components/city/CoworkingSection.tsx`
  - 카드 형태: 이미지, 이름, 주소, 일/월 가격, 편의시설 태그, 영업시간, 평점
  - 가로 스크롤 또는 그리드

### 검증 체크리스트
- [ ] 장점/단점이 올바른 색상으로 분리 표시
- [ ] 리뷰가 최신순으로 정렬되어 표시
- [ ] 사진 클릭 시 라이트박스 열림/닫힘
- [ ] 코워킹 카드 정보가 정확히 표시
- [ ] 각 섹션이 탭 네비에서 정확히 연결

---

## Phase 5. 주변도시 + 반응형 + 마무리

### 오버뷰
주변 도시 추천, 모바일 반응형 최적화, 전체 페이지 완성도를 높인다. 완료되면 도시 상세페이지가 데스크톱/모바일 모두에서 완전하게 동작한다.

### 현재 상태 (Phase 4 완료 후)
- 모든 콘텐츠 섹션 구현 완료
- 데이터: nearbyFrom 관계 로드 완료
- 반응형 미최적화 상태

### 수정/개선 체크리스트
- [ ] **주변 도시 섹션** — `components/city/NearbyCities.tsx`
  - 기존 CityCard 컴포넌트 재사용 (축소 버전)
  - 가로 스크롤 캐러셀 형태
  - 클릭 시 해당 도시 상세페이지로 이동
- [ ] **반응형 최적화**
  - Hero: 모바일에서 높이 200px, 텍스트 크기 축소
  - 탭 네비: 모바일에서 가로 스크롤
  - 스코어 섹션: 모바일 1열
  - 코워킹/사진: 모바일 그리드 축소
  - 전체 섹션 간 간격/패딩 통일
- [ ] **로딩 & 에러 상태**
  - `app/cities/[slug]/loading.tsx` — 스켈레톤 UI
  - `app/cities/[slug]/not-found.tsx` — 404 페이지 ("존재하지 않는 도시입니다")
- [ ] **MVP_SPEC.md 업데이트**
  - 삭제 대상에서 `/cities/[slug]` 제거
  - 페이지 구조 테이블에 도시 상세페이지 추가

### 검증 체크리스트
- [ ] 주변 도시 클릭 → 해당 상세페이지 이동 (페이지 간 네비게이션)
- [ ] 모바일(375px) / 태블릿(768px) / 데스크톱(1280px) 3개 뷰포트에서 레이아웃 정상
- [ ] 존재하지 않는 slug 접속 시 404 페이지 표시
- [ ] 느린 네트워크에서 로딩 스켈레톤 표시
- [ ] 홈 → 상세 → 주변도시 → 상세 → 홈 전체 플로우 정상

---

## 요약

| Phase | 핵심 작업 | 완료 시 상태 |
|-------|----------|-------------|
| 1 | API 엔드포인트 + 타입 정의 | `/api/cities/[slug]`로 전체 도시 데이터 조회 가능 |
| 2 | 페이지 라우트 + Hero + 탭 네비 | CityCard 클릭 → 상세페이지 이동, Hero 렌더링 |
| 3 | 스코어 바 + 생활비 테이블 + 날씨 차트 | 정량 데이터 3개 섹션 시각화 완료 |
| 4 | 장단점 + 리뷰 + 사진 + 코워킹 | 정성 데이터 4개 섹션 표시 완료 |
| 5 | 주변도시 + 반응형 + 로딩/에러 | 전체 페이지 완성, 모바일 대응, 프로덕션 준비 |
