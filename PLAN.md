# MVP 스펙 적용 + 도시 상세페이지 구현 계획

> 작성일: 2026-03-28
> 전략: 스펙 우선 — 홈페이지를 MVP 스펙에 맞게 정리한 뒤, 도시 상세페이지를 추가
> 핵심 변경: 별점/평점 → 좋아요/싫어요 전환, 필터 4개로 축소, 카드 구조 변경
> 도시 정보: 예산 / 지역 / 환경 / 최고의 계절 + 좋아요·싫어요 (이것만)

---

## Phase 1. 데이터 모델 변경 (좋아요/싫어요 + 환경/계절 필드)

### 오버뷰
MVP 스펙의 핵심인 좋아요/싫어요 시스템과 새로운 필터 기준(환경, 최고의 계절)을 데이터 모델에 반영한다. 완료되면 City에 `likes`, `dislikes`, `environment`, `bestSeason` 필드가 추가되고, 좋아요 기록 테이블이 생성된다.

### 현재 상태
- City 모델: `overallScore`(별점), `internetSpeed`, `currentTemp`, `hasKTX`, `isSeaside` 등 MVP에서 불필요한 필드 다수
- MVP 스펙에 필요한 필드: `likes`, `dislikes`, `environment`, `bestSeason` → 없음
- `lib/types.ts` — `City` 인터페이스, `FilterParams` 인터페이스
- `lib/constants.ts` — `SORT_OPTIONS`, `INTERNET_RANGES` 등 삭제 대상 상수 다수

### 수정/개선 체크리스트
- [ ] **Prisma 스키마 변경** — `prisma/schema.prisma`
  - City 모델에 추가: `likes Int @default(0)`, `dislikes Int @default(0)`, `environment String` (JSON 배열: "바다","산/자연","도심","소도시"), `bestSeason String` (JSON 배열: "봄","여름","가을","겨울")
  - 새 모델 `CityVote`: `id`, `citySlug`, `userId`, `type` ("like"|"dislike"), `@@unique([citySlug, userId])`
  - 기존 불필요 필드는 유지 (마이그레이션 리스크 최소화)
- [ ] **마이그레이션 실행** — `npx prisma migrate dev --name add-likes-environment-season`
- [ ] **타입 업데이트** — `lib/types.ts`
  - `City` 인터페이스에 `likes`, `dislikes`, `environment: string[]`, `bestSeason: string[]` 추가
  - `FilterParams`에 `environment?: string`, `bestSeason?: string` 추가, `minInternet`, `hasKTX`, `isSeaside`, `sort` 제거
- [ ] **상수 업데이트** — `lib/constants.ts`
  - `SORT_OPTIONS`, `INTERNET_RANGES` 삭제
  - `COST_RANGES` 스펙 기준으로 변경: 80만 이하, 80~120만, 120~160만, 160만 이상
  - `ENVIRONMENTS` 추가: `["바다", "산/자연", "도심", "소도시"]`
  - `SEASONS` 추가: `["봄", "여름", "가을", "겨울"]`
- [ ] **시드 데이터 업데이트** — `prisma/seed.ts`
  - 30개 도시에 `likes`, `dislikes` 초기값 (임의 숫자)
  - 30개 도시에 `environment`, `bestSeason` 값 설정 (각 도시 1개 이상)
- [ ] **매퍼 업데이트** — `lib/data/mappers.ts`
  - `mapCityCard()`에 `likes`, `dislikes`, `environment`, `bestSeason` 추가
  - `environment`/`bestSeason`은 JSON.parse로 배열 변환

### 검증 체크리스트
- [ ] `npx prisma migrate dev` 성공
- [ ] `npx prisma db seed` 성공, 30개 도시에 likes/dislikes/environment/bestSeason 존재
- [ ] 기존 데이터(metrics, costs 등) 손상 없음
- [ ] `npx prisma studio`에서 새 필드 확인

---

## Phase 2. 좋아요/싫어요 API + 필터 로직 변경

### 오버뷰
좋아요/싫어요 토글 API와 MVP 스펙 기준 필터링 로직을 구현한다. 완료되면 좋아요/싫어요 API가 동작하고, 4개 필터(예산/지역/환경/계절) + 좋아요순 정렬이 적용된다.

### 현재 상태 (Phase 1 완료 후)
- City에 `likes`, `dislikes`, `environment`, `bestSeason` 필드 존재
- `CityVote` 테이블로 사용자별 투표 기록 가능
- `lib/data/index.ts` — `filterCities()`가 기존 필터(region, maxCost, minInternet, hasKTX, isSeaside) 사용 중

### 수정/개선 체크리스트
- [ ] **좋아요/싫어요 API** — `app/api/cities/[slug]/vote/route.ts`
  - POST `{ type: "like" | "dislike" }`
  - 로그인 필수 (Supabase Auth 세션 확인), 비로그인 시 401
  - 같은 타입 재클릭 → 토글 해제 (CityVote 삭제 + likes/dislikes -1)
  - 다른 타입 클릭 → 기존 해제 + 새 타입 활성화 (CityVote upsert + 카운트 조정)
  - 응답: `{ likes, dislikes, userVote: "like"|"dislike"|null }`
- [ ] **사용자 투표 상태 조회** — GET 동일 경로
  - 로그인 시: 해당 도시에 대한 현재 투표 상태 반환
  - 비로그인 시: `{ userVote: null }`
- [ ] **필터 로직 변경** — `lib/data/index.ts`의 `filterCities()`
  - `minInternet`, `hasKTX`, `isSeaside` 필터 제거
  - `environment` 필터 추가: `environment` 필드(JSON 문자열)에 해당 값 포함 여부 (`contains`)
  - `bestSeason` 필터 추가: 동일 방식
  - `maxCost` 범위 필터 변경: "80" → ≤80, "80-120" → 80<x≤120, "120-160" → 120<x≤160, "160" → >160
  - 기본 정렬: `likes` 내림차순
  - `sort` 파라미터 제거
- [ ] **API 라우트 업데이트** — `app/api/cities/route.ts`
  - `searchParams`에서 `environment`, `bestSeason` 파싱
  - `minInternet`, `hasKTX`, `isSeaside`, `sort` 제거

### 검증 체크리스트
- [ ] POST `/api/cities/jeju/vote` `{ type: "like" }` → likes +1, 재호출 → likes -1 (토글)
- [ ] like 상태에서 dislike → likes -1, dislikes +1
- [ ] 비로그인 시 401 응답
- [ ] `/?environment=바다` → 바다 환경 도시만 반환
- [ ] `/?bestSeason=여름` → 여름 추천 도시만 반환
- [ ] 기본 정렬이 likes 내림차순

---

## Phase 3. 홈페이지 UI 변경 (카드 + 필터 + 그리드)

### 오버뷰
CityCard, FilterBar, CityGrid를 MVP 스펙에 맞게 변경한다. 완료되면 홈페이지가 MVP 스펙과 일치한다.

### 현재 상태 (Phase 2 완료 후)
- API가 새 필터 + 좋아요순 정렬로 동작
- CityCard: 순위(#1), 인터넷 속도, 현재 기온, 호버 바차트 표시 중 → **삭제 대상**
- FilterBar: 지역, 생활비, 인터넷, KTX, 바다, 정렬 6개 → **4개로 축소**
- CityGrid: "총 N개 도시" → "도시 리스트"로 변경

### 수정/개선 체크리스트
- [ ] **CityCard 재구성** — `components/home/CityCard.tsx`
  - 삭제: 순위(`#{rank}`), 인터넷 속도, 현재 기온, 호버 시 6개 지표 바차트, `isHovered` 상태
  - 새 카드 구조 (MVP 스펙 §6):
    ```
    [도시 이미지]
    도시명
    지역
    💰 예산     80만원/월
    📍 지역     전라
    🌿 환경     소도시
    🌸 최고의 계절  봄
    👍 42    👎 3
    ```
  - 좋아요/싫어요 버튼: 클릭 시 API 호출, 토글 동작, 색상 변경 (좋아요=빨강, 싫어요=파랑)
  - 비로그인 시 클릭 → 로그인 페이지로 이동
  - Props 변경: `rank` 제거
  - `/cities/${city.slug}` 링크 유지 (Phase 4에서 상세페이지 연결)
- [ ] **FilterBar 변경** — `components/home/FilterBar.tsx`
  - 삭제: 인터넷 속도 필터, KTX 버튼, 바다 버튼, 정렬 드롭다운
  - 유지: 지역 필터, 예산 필터
  - 추가: 환경 필터 (바다/산·자연/도심/소도시), 최고의 계절 필터 (봄/여름/가을/겨울)
  - 4개 필터 가로 배치, 초기화 버튼 유지
- [ ] **CityGrid 변경** — `components/home/CityGrid.tsx`
  - "총 N개 도시" → "도시 리스트"로 텍스트 변경
  - `rank` prop 전달 제거
- [ ] **constants 정리** — `lib/constants.ts`
  - `INTERNET_RANGES`, `SORT_OPTIONS` 삭제
  - `COST_RANGES` 스펙 기준 업데이트

### 검증 체크리스트
- [ ] 카드에 순위/인터넷/기온/호버 바차트 없음
- [ ] 카드에 예산/지역/환경/계절 + 좋아요·싫어요 수 표시
- [ ] 좋아요 클릭 → 빨강 아이콘 + 수 +1, 다시 클릭 → 해제
- [ ] 필터 4개만 표시: 예산, 지역, 환경, 최고의 계절
- [ ] 정렬 드롭다운 없음, 기본 좋아요순
- [ ] "도시 리스트" 텍스트 표시

---

## Phase 4. 도시 상세페이지 구현

### 오버뷰
`/cities/[slug]` 라우트를 생성하고, 도시 이미지 + 4개 정보(예산/지역/환경/계절) + 좋아요/싫어요만 표시하는 MVP 상세페이지를 구현한다. 카드와 동일한 정보를 더 넓은 레이아웃으로 보여주되, MVP 범위를 벗어나지 않는다.

### 현재 상태 (Phase 3 완료 후)
- 홈페이지가 MVP 스펙 일치
- CityCard가 `/cities/${city.slug}` 링크 설정됨 (클릭 시 404)
- 좋아요/싫어요 API 동작 중
- City 데이터에 `likes`, `dislikes`, `environment`, `bestSeason` 존재

### 수정/개선 체크리스트
- [ ] **데이터 함수** — `lib/data/index.ts`
  - `getCityBySlug(slug)` 추가: `prisma.city.findUnique({ where: { slug } })`
  - 반환: 기본 필드 + likes/dislikes/environment/bestSeason (관계 include 불필요)
  - null이면 null 반환
- [ ] **페이지 라우트** — `app/cities/[slug]/page.tsx`
  - Server Component, `getCityBySlug(params.slug)`, null이면 `notFound()`
  - `generateMetadata()`: `${city.name} - K-Nomad`
- [ ] **상세페이지 레이아웃** — `components/city/CityDetail.tsx`
  - Hero: 도시 이미지 (full-width, h-[200px] md:h-[320px]), 그라데이션 오버레이, 도시명 + 영문명
  - "← 목록으로" 링크 (`/` 이동)
  - 4개 정보 카드 (2x2 그리드):
    ```
    💰 예산        📍 지역
    80만원/월       전라

    🌿 환경        🌸 최고의 계절
    소도시          봄, 가을
    ```
  - 좋아요/싫어요 버튼 (큰 버전): 카드와 동일 API 사용, 토글 동작
  - 비로그인 시 → 로그인 이동
  - 도시 설명 텍스트 (`city.description`)
- [ ] **에러 상태** — `app/cities/[slug]/not-found.tsx`
  - "존재하지 않는 도시입니다" + 홈으로 돌아가기 버튼

### 검증 체크리스트
- [ ] CityCard 클릭 → `/cities/jeju` → Hero + 4개 정보 + 좋아요/싫어요 렌더링
- [ ] 상세페이지 좋아요 클릭 → 홈 카드 카운트와 동기화
- [ ] `/cities/nonexistent` → 404 페이지
- [ ] "← 목록으로" → 홈 이동
- [ ] 모바일/데스크톱 반응형 정상

---

## Phase 5. 반응형 + MVP_SPEC 반영 + 마무리

### 오버뷰
전체 반응형 최적화, MVP_SPEC.md 업데이트, 네비게이션 정리를 완료한다.

### 현재 상태 (Phase 4 완료 후)
- 홈페이지 + 상세페이지 모두 동작
- MVP_SPEC.md에 상세페이지가 "삭제 대상"으로 남아 있음

### 수정/개선 체크리스트
- [ ] **MVP_SPEC.md 업데이트**
  - 페이지 구조 테이블에 `/cities/[slug]` 추가 (도시 상세 — 4개 정보 + 좋아요/싫어요)
  - 삭제 대상에서 `/cities/[slug]` 제거
- [ ] **반응형 최적화**
  - CityCard: 모바일 2열 유지, 텍스트 크기 조정
  - FilterBar: 모바일에서 2x2 그리드 또는 가로 스크롤
  - 상세페이지: Hero 높이 조정, 정보 카드 모바일 1열 → 데스크톱 2x2
- [ ] **네비게이션 확인** — `components/layout/Header.tsx`
  - 스펙 §3: 로고(홈 이동), 로그인/회원가입 또는 닉네임/로그아웃만 유지
- [ ] **Hero 섹션 확인** — `components/home/Hero.tsx`
  - 스펙 §9: 이메일 입력 + "무료로 시작하기" CTA 유지

### 검증 체크리스트
- [ ] MVP_SPEC.md와 실제 구현 일치
- [ ] 모바일(375px) / 태블릿(768px) / 데스크톱(1280px) 전체 정상
- [ ] 전체 플로우: 홈 → 카드 클릭 → 상세 → 좋아요 → ← 목록 → 홈 (좋아요 반영)
- [ ] 비로그인: 좋아요 클릭 → 로그인 페이지 이동
- [ ] 네비게이션: 로고, 로그인/회원가입만 표시 (비로그인 시)

---

## 요약

| Phase | 핵심 작업 | 완료 시 상태 |
|-------|----------|-------------|
| 1 | 데이터 모델 (likes, environment, bestSeason) | 새 필드 + 마이그레이션 완료 |
| 2 | 좋아요 API + 필터 4개로 축소 | API 동작, 좋아요순 정렬 |
| 3 | 홈 UI (카드 재구성 + 필터 축소) | 홈페이지 = MVP 스펙 |
| 4 | 도시 상세페이지 (4개 정보 + 좋아요/싫어요) | 상세페이지 동작 |
| 5 | 반응형 + 스펙 문서 + 마무리 | 프로덕션 준비 완료 |
