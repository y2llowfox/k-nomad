# K-Nomad MVP 실행 계획

> 기준 문서: `MVP_SPEC.md`
> 작성일: 2026-03-28
> 데이터: 가짜 데이터 사용 (DB 미사용)

---

## Phase 1. 페이지 정리 & 네비게이션 단순화

### 오버뷰

불필요한 페이지와 컴포넌트를 삭제하고, 네비게이션을 로고 + 인증 버튼만 남긴다.
사이드바를 제거하고 홈페이지 레이아웃을 전체 너비로 변경한다.
이 단계가 끝나면 사이트는 홈(`/`), 로그인(`/login`), 회원가입(`/register`) 3개 페이지만 존재한다.

### 현재 상태

- 페이지: 홈, 도시 상세, 비교, 리뷰 작성, 프로그램, 이용약관, 개인정보, 문의하기, 로그인, 회원가입
- 네비게이션: 로고, 홈, 비교, 로그인/회원가입
- 사이드바: 워케이션 프로그램, 밋업, 여행 중 유저, 오늘의 추천, CTA 카드
- Footer: 이용약관, 개인정보, 문의하기 링크

### 수정/개선 체크리스트

- [ ] **페이지 삭제** — 다음 디렉토리/파일 삭제
  - `app/cities/` (도시 상세 페이지)
  - `app/compare/` (도시 비교 페이지)
  - `app/review/` (리뷰 작성 페이지)
  - `app/programs/` (워케이션 프로그램 페이지)
  - `app/terms/` (이용약관)
  - `app/privacy/` (개인정보처리방침)
  - `app/contact/` (문의하기)
- [ ] **API 라우트 삭제** — 삭제된 페이지와 연결된 API 정리
  - `app/api/cities/[slug]/reviews/` (리뷰 작성 API)
  - `app/api/cities/[slug]/coworkings/` (코워킹 API)
  - `app/api/cities/[slug]/nearby/` (주변 도시 API)
  - `app/api/cities/compare/` (비교 API)
  - `app/api/reviews/[id]/vote/` (리뷰 투표 API)
  - `app/api/programs/` (프로그램 API)
  - `app/api/meetups/` (밋업 API)
- [ ] **컴포넌트 삭제** — 삭제된 페이지 전용 컴포넌트 정리
  - `components/city/` 디렉토리 전체 (CityHero, CityTabs, 8개 탭)
  - `components/compare/` 디렉토리 전체 (CitySelector, ComparisonTable)
  - `components/review/` 디렉토리 전체 (ReviewForm)
  - `components/home/Sidebar.tsx` (사이드바)
  - `components/shared/CityCardMini.tsx` (미니 카드 — 주변 도시용)
  - `components/shared/MetricBar.tsx` (지표 바)
  - `components/shared/ScoreBadge.tsx` (점수 뱃지)
- [ ] **네비게이션 단순화** — `components/layout/Header.tsx` 수정
  - "홈", "비교" 등 페이지 이동 링크 삭제
  - 로고 (홈 이동) + 로그인/회원가입 버튼만 유지
- [ ] **모바일 네비게이션 단순화** — `components/layout/MobileNav.tsx` 수정
  - "홈", "도시 비교", "워케이션 프로그램" 링크 삭제
  - 로그인/회원가입(또는 닉네임/로그아웃)만 유지
- [ ] **Footer 단순화** — `components/layout/Footer.tsx` 수정
  - 이용약관, 개인정보, 문의하기 링크 삭제 (페이지가 없으므로)
  - 로고 + 카피라이트만 유지
- [ ] **홈페이지 레이아웃 변경** — `app/page.tsx` 수정
  - `<Sidebar />` 제거
  - `flex gap-6` 레이아웃에서 사이드바 영역 제거, CityGrid가 전체 너비 사용
- [ ] **데이터 레이어 정리** — `lib/data/index.ts` 수정
  - 삭제된 기능 관련 함수 제거: `getCityBySlug`, `compareCities`, `getNearbyCities`, `getReviewsForCity`, `getCoworkingsForCity`, `getWorkationPrograms`, `getMeetups`
  - `getAllCities`, `filterCities`만 유지

### 검증 체크리스트

- [ ] `next build` 성공 (에러 0건)
- [ ] `http://localhost:3000` 접속 시 홈페이지 정상 표시 (Hero + 필터 + 도시 카드 그리드)
- [ ] 사이드바가 표시되지 않음
- [ ] Header에 "홈", "비교" 등 페이지 이동 링크가 없음
- [ ] Header에 로고 + 로그인/회원가입 버튼만 표시
- [ ] Footer에 삭제된 페이지 링크가 없음
- [ ] `/login`, `/register` 정상 접속 및 동작
- [ ] `/cities/jeju`, `/compare`, `/programs` 등 삭제된 경로 접속 시 404
- [ ] 콘솔 에러 0건

---

## Phase 2. 도시 데이터 모델 변경

### 오버뷰

기존 도시 데이터에 `environment`(환경), `bestSeason`(최고의 계절), `likes`(좋아요 수), `dislikes`(싫어요 수) 필드를 추가한다.
기존에 사용하지 않는 필드(`metrics`, `costs`, `weather`, `pros`, `cons`, `photos`, `nearbySlugs`, `overallScore`, `reviewCount`, `internetSpeed`, `currentTemp`, `weatherIcon`, `hasKTX`)는 제거한다.
30개 도시 모두 새 필드를 최소 1개씩 가지도록 가짜 데이터를 업데이트한다.

### 현재 상태 (Phase 1 완료 후)

- 도시 데이터는 `lib/data/cities.ts`에 하드코딩
- City 타입은 `lib/types.ts`에 정의
- 도시마다 metrics(12개 지표), costs, weather, pros, cons 등 복잡한 중첩 데이터 보유
- environment, bestSeason, likes, dislikes 필드 없음

### 수정/개선 체크리스트

- [ ] **타입 수정** — `lib/types.ts`의 `City` 인터페이스 변경
  - 추가할 필드:
    - `environment: string[]` — "바다" | "산/자연" | "도심" | "소도시"
    - `bestSeason: string[]` — "봄" | "여름" | "가을" | "겨울"
    - `likes: number` — 좋아요 수
    - `dislikes: number` — 싫어요 수
  - 제거할 필드: `overallScore`, `reviewCount`, `metrics`, `costs`, `internetSpeed`, `currentTemp`, `weatherIcon`, `hasKTX`, `highlights`, `pros`, `cons`, `weather`, `nearbySlugs`, `photos`
  - 유지할 필드: `slug`, `name`, `nameEn`, `region`, `category`, `description`, `imageUrl`, `monthlyCost`, `isSeaside`
- [ ] **FilterParams 타입 수정** — `lib/types.ts`
  - 제거: `maxCost`, `minInternet`, `hasKTX`, `sort`
  - 추가: `budget` (예산 범위), `environment`, `bestSeason`
  - 유지: `region`, `isSeaside` (삭제 가능 — environment "바다"로 대체)
- [ ] **상수 수정** — `lib/constants.ts`
  - 추가: `ENVIRONMENTS` = ["바다", "산/자연", "도심", "소도시"]
  - 추가: `SEASONS` = ["봄", "여름", "가을", "겨울"]
  - 추가: `BUDGET_RANGES` = [{ value: "80", label: "80만 이하" }, { value: "80-120", label: "80~120만" }, { value: "120-160", label: "120~160만" }, { value: "160", label: "160만 이상" }]
  - 제거: `METRICS`, `SORT_OPTIONS`, `INTERNET_RANGES`, `COST_RANGES`, `PRO_TAGS`, `CON_TAGS`, `PROFESSIONS`, `STAY_DURATIONS`
  - 유지: `REGIONS`
- [ ] **도시 데이터 업데이트** — `lib/data/cities.ts`
  - 30개 도시 각각에 `environment`, `bestSeason`, `likes`, `dislikes` 추가
  - 복잡한 중첩 데이터(metrics, costs, weather 등) 제거
  - makeCity 헬퍼 함수 단순화
  - 도시별 environment/bestSeason 예시:
    - 제주: environment=["바다","산/자연"], bestSeason=["봄","가을"]
    - 강릉: environment=["바다"], bestSeason=["여름","가을"]
    - 서울: environment=["도심"], bestSeason=["봄","가을"]
    - 전주: environment=["소도시"], bestSeason=["봄","가을"]
    - 속초: environment=["바다","산/자연"], bestSeason=["여름"]
    - ... (30개 모두 작성)
- [ ] **불필요한 데이터 파일 삭제** — `lib/data/` 정리
  - `reviews.ts` 삭제
  - `coworkings.ts` 삭제
  - `programs.ts` 삭제
  - `mappers.ts` 삭제 (Prisma 매퍼 — DB 미사용)
- [ ] **데이터 레이어 수정** — `lib/data/index.ts`
  - `filterCities` 함수를 새 필터 기준으로 변경 (Phase 3에서 UI 연결)
  - 좋아요 내림차순 기본 정렬 적용

### 검증 체크리스트

- [ ] `next build` 성공
- [ ] 홈페이지에서 30개 도시 카드가 모두 표시됨
- [ ] 각 도시 데이터에 environment, bestSeason, likes, dislikes가 존재함
- [ ] TypeScript 타입 에러 0건
- [ ] 기존 metrics, costs, weather 등 복잡한 데이터가 제거됨

---

## Phase 3. 필터 시스템 교체

### 오버뷰

기존 5개 필터(지역, 생활비, 인터넷, KTX, 바다)와 정렬 옵션을 삭제하고, MVP 스펙에 정의된 4개 필터(예산, 지역, 환경, 최고의 계절)로 교체한다. 정렬 드롭다운은 삭제하고 기본 정렬은 좋아요 수 내림차순으로 고정한다.

### 현재 상태 (Phase 2 완료 후)

- FilterBar에 기존 5개 필터 + 정렬 드롭다운이 남아있음
- 도시 데이터에 environment, bestSeason 필드가 추가됨
- filterCities 함수가 새 필터 기준으로 변경됨 (아직 UI 미연결)

### 수정/개선 체크리스트

- [ ] **FilterBar 컴포넌트 재작성** — `components/home/FilterBar.tsx`
  - 기존 필터 UI 전부 삭제
  - 새 필터 4개 추가:
    - 예산: Select 드롭다운 ("전체", "80만 이하", "80~120만", "120~160만", "160만 이상")
    - 지역: Select 드롭다운 ("전체 지역", "서울/경기", "강원", "충청", "전라", "경상", "제주")
    - 환경: Select 드롭다운 ("전체", "바다", "산/자연", "도심", "소도시")
    - 최고의 계절: Select 드롭다운 ("전체", "봄", "여름", "가을", "겨울")
  - 정렬 드롭다운 삭제
  - URL searchParams로 필터 상태 관리 (기존 패턴 유지)
  - 필터 초기화 버튼 유지
- [ ] **filterCities 함수 연결** — `lib/data/index.ts`
  - FilterParams에 맞게 필터링 로직 구현:
    - `budget`: "80" → monthlyCost <= 80, "80-120" → 80 < monthlyCost <= 120, "120-160" → 120 < monthlyCost <= 160, "160" → monthlyCost > 160
    - `region`: 기존과 동일 (region 일치)
    - `environment`: 도시의 environment 배열에 해당 값 포함 여부
    - `bestSeason`: 도시의 bestSeason 배열에 해당 값 포함 여부
  - 정렬: 항상 likes 내림차순
- [ ] **홈페이지 searchParams 연결** — `app/page.tsx`
  - 새 FilterParams 타입에 맞게 searchParams 전달

### 검증 체크리스트

- [ ] `next build` 성공
- [ ] FilterBar에 4개 필터 드롭다운이 표시됨
- [ ] 정렬 드롭다운이 없음
- [ ] 예산 필터: "80만 이하" 선택 시 monthlyCost 80 이하 도시만 표시
- [ ] 지역 필터: "강원" 선택 시 강원 도시만 표시
- [ ] 환경 필터: "바다" 선택 시 environment에 "바다"가 포함된 도시만 표시
- [ ] 최고의 계절 필터: "봄" 선택 시 bestSeason에 "봄"이 포함된 도시만 표시
- [ ] 필터 2개 이상 조합 시 AND 조건으로 동작
- [ ] 도시 리스트가 좋아요 수 내림차순으로 정렬됨
- [ ] 필터 초기화 클릭 시 모든 필터 해제

---

## Phase 4. 도시 카드 재디자인

### 오버뷰

기존 도시 카드의 순위, 인터넷 속도, 기온, 호버 차트를 제거하고, 필터 기준에 해당하는 4개 항목(예산, 지역, 환경, 최고의 계절)을 key-value 형태로 표시한다. 좋아요/싫어요 수를 카드 하단에 표시한다. 상단 "총 N개 도시"를 "도시 리스트"로 변경한다.

### 현재 상태 (Phase 3 완료 후)

- CityCard 컴포넌트: 순위(#1~#30), 이미지, 도시명, 지역, 인터넷 속도, 기온, 월 생활비, 호버 시 6개 지표 바 차트 표시
- CityGrid: "총 N개 도시" 헤더 + 4열 그리드
- 도시 데이터에 environment, bestSeason, likes, dislikes 존재

### 수정/개선 체크리스트

- [ ] **CityCard 재작성** — `components/home/CityCard.tsx`
  - 삭제할 요소:
    - 순위 배지 (#1, #2 ...)
    - 인터넷 속도 (📡 95Mbps)
    - 현재 기온 (☀️ 12°)
    - 호버 시 반투명 오버레이 + 6개 지표 바 차트
  - 새 카드 구조:
    ```
    [도시 이미지]
    도시명
    지역

    💰 예산        80만원/월
    📍 지역        전라
    🌿 환경        소도시
    🌸 최고의 계절  봄, 가을

    👍 42    👎 3
    ```
  - key-value는 좌측 라벨(이모지+텍스트) + 우측 값으로 정렬
  - 좋아요/싫어요는 카드 하단에 아이콘 + 숫자로 표시 (이 단계에서는 클릭 불가, 숫자만 표시)
  - 카드 클릭 시 아무 페이지로 이동하지 않음 (도시 상세 페이지 삭제됨)
    - 기존 `<Link href={/cities/${slug}}>` 래퍼 제거
- [ ] **CityGrid 수정** — `components/home/CityGrid.tsx`
  - "총 N개 도시" → "도시 리스트"로 텍스트 변경
  - 그리드 열 수 조정 (모바일 1열, 태블릿 2열, 데스크톱 3~4열 유지)

### 검증 체크리스트

- [ ] `next build` 성공
- [ ] 도시 카드에 순위 번호가 없음
- [ ] 도시 카드에 인터넷 속도, 기온이 없음
- [ ] 도시 카드 호버 시 바 차트 오버레이가 없음
- [ ] 도시 카드에 예산, 지역, 환경, 최고의 계절이 key-value로 표시됨
- [ ] 도시 카드 하단에 좋아요/싫어요 숫자가 표시됨
- [ ] 상단 텍스트가 "도시 리스트"로 표시됨
- [ ] 도시 카드 클릭 시 페이지 이동이 없음
- [ ] 반응형 레이아웃 정상 (모바일/태블릿/데스크톱)
- [ ] 콘솔 에러 0건

---

## Phase 5. 좋아요/싫어요 인터랙션 구현

### 오버뷰

도시 카드의 좋아요/싫어요 버튼에 클릭 인터랙션을 추가한다.
클릭 시 아이콘 색상이 변경되고, 좋아요/싫어요 수가 증감한다.
데이터는 로컬 state로 관리한다 (DB 미사용).
비로그인 시 클릭하면 로그인 페이지로 안내한다.

### 현재 상태 (Phase 4 완료 후)

- 도시 카드에 👍 / 👎 숫자가 표시되지만 클릭 불가
- 인증 시스템은 Supabase Auth로 동작 중 (로그인/회원가입 가능)
- Header에서 로그인 상태를 Supabase로 확인 중

### 수정/개선 체크리스트

- [ ] **좋아요/싫어요 버튼 컴포넌트 생성** — `components/home/VoteButtons.tsx` (새 파일)
  - "use client" 컴포넌트
  - Props: `citySlug`, `initialLikes`, `initialDislikes`
  - 상태 관리:
    - `voteState`: "none" | "liked" | "disliked"
    - `likes`: number (로컬 state)
    - `dislikes`: number (로컬 state)
  - 좋아요 버튼 클릭 로직:
    - 현재 "none" → "liked": 아이콘 빨간색, likes +1
    - 현재 "liked" → "none": 아이콘 원복, likes -1 (토글 해제)
    - 현재 "disliked" → "liked": 아이콘 빨간색, likes +1, dislikes -1
  - 싫어요 버튼 클릭 로직:
    - 현재 "none" → "disliked": 아이콘 파란색, dislikes +1
    - 현재 "disliked" → "none": 아이콘 원복, dislikes -1 (토글 해제)
    - 현재 "liked" → "disliked": 아이콘 파란색, dislikes +1, likes -1
  - 비로그인 시 클릭하면 `/login`으로 이동 (useRouter)
  - 로그인 상태 확인: Supabase `createClient().auth.getUser()`
- [ ] **CityCard에 VoteButtons 통합** — `components/home/CityCard.tsx` 수정
  - 기존 좋아요/싫어요 숫자 텍스트를 `<VoteButtons />` 컴포넌트로 교체
  - CityCard는 Server Component이므로 VoteButtons만 Client Component로 분리
- [ ] **CityGrid를 Client Component로 전환 또는 유지**
  - CityGrid 자체는 Server Component 유지 가능
  - VoteButtons가 Client Component이므로 카드 내부에서 처리

### 검증 체크리스트

- [ ] `next build` 성공
- [ ] 비로그인 상태에서 좋아요/싫어요 클릭 시 `/login`으로 이동
- [ ] 로그인 후 좋아요 클릭 시:
  - [ ] 👍 아이콘이 빨간색으로 변경
  - [ ] 좋아요 수가 +1
- [ ] 좋아요 상태에서 다시 좋아요 클릭 시:
  - [ ] 아이콘 색상 원복 (회색)
  - [ ] 좋아요 수가 -1 (토글 해제)
- [ ] 좋아요 상태에서 싫어요 클릭 시:
  - [ ] 👍 빨간색 해제, 👎 파란색 활성화
  - [ ] 좋아요 수 -1, 싫어요 수 +1
- [ ] 싫어요 클릭/토글도 동일하게 동작
- [ ] 페이지 새로고침 시 투표 상태 초기화됨 (DB 미사용이므로 정상)
- [ ] 콘솔 에러 0건
- [ ] 모바일에서도 버튼 클릭 정상 동작

---

## Phase 요약

| Phase | 핵심 작업 | 완료 시 상태 |
|-------|----------|-------------|
| **1** | 페이지/컴포넌트 삭제, 네비/사이드바/Footer 단순화 | 홈+인증 3페이지만 존재, 사이드바 없음 |
| **2** | City 타입에 environment/bestSeason/likes/dislikes 추가, 30개 도시 데이터 업데이트 | 새 데이터 모델 준비 완료 |
| **3** | FilterBar를 4개 필터로 교체, 정렬 삭제, filterCities 로직 변경 | 새 필터로 도시 필터링 동작 |
| **4** | CityCard 재디자인 (key-value 레이아웃), 순위/기온/인터넷 삭제 | MVP 카드 디자인 완성 |
| **5** | 좋아요/싫어요 클릭 인터랙션, 색상 변경, 토글 로직 | MVP 기능 완성 |
