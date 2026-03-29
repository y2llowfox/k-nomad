# K-Nomad 프로젝트 가이드

## 테스트

### 유닛 테스트 (Vitest)

```bash
npm run test        # watch 모드
npm run test:run    # 1회 실행
npm run test:coverage
```

- 프레임워크: Vitest + React Testing Library
- 설정: `vitest.config.ts`, `vitest.setup.ts`
- 위치: 각 모듈 옆 `__tests__/` 폴더 (co-location)
- 총 85개 테스트, 9개 파일

### E2E 테스트 (Playwright)

```bash
npm run test:e2e      # headless 실행
npm run test:e2e:ui   # UI 모드
```

- 프레임워크: Playwright (Chromium)
- 설정: `playwright.config.ts`
- dev 서버 자동 시작 (`localhost:3000`)

#### 디렉토리 구조

```
e2e/
├── home.spec.ts           # 홈페이지 + 필터 (12개)
├── city-detail.spec.ts    # 도시 상세페이지 (8개)
├── auth.spec.ts           # 로그인/회원가입 (10개)
├── voting.spec.ts         # 좋아요/싫어요 투표 (8개)
└── fixtures/
    └── test-utils.ts      # loginAsTestUser() 헬퍼, 테스트 계정 상수
```

#### 스펙 파일별 범위

| 파일 | 범위 | Auth 필요 |
|------|------|----------|
| `home.spec.ts` | 페이지 로딩, Hero CTA, 4개 필터 동작, 빈 결과 | No |
| `city-detail.spec.ts` | 상세 정보, 네비게이션, 404 | No |
| `auth.spec.ts` | 로그인/회원가입 폼 검증, 헤더 상태 | No |
| `voting.spec.ts` | 비로그인 리다이렉트, 투표 토글/전환 | Yes |

#### 테스트 계정

`voting.spec.ts`는 Supabase에 등록된 테스트 계정이 필요하다.
계정 정보는 `e2e/fixtures/test-utils.ts`의 `TEST_USER` 상수에 정의.

## 기술 스택

- Next.js 14 / React 18 / TypeScript 5
- Prisma 5 (PostgreSQL via Supabase)
- Supabase Auth (SSR)
- Tailwind CSS + shadcn/ui
