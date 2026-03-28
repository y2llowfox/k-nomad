# K-Nomad - 대한민국 디지털 노마드 도시 가이드

한국에서 원격근무하며 살기 좋은 도시를 찾아주는 플랫폼입니다. 30개 도시의 생활비, 인터넷 속도, 코워킹, 안전 등 12개 지표를 비교하고 실사용자 리뷰를 확인할 수 있습니다.

## 주요 기능

- **도시 카드 리스트** — 30개 도시를 한눈에 비교, 호버 시 6개 핵심 지표 바 차트 표시
- **필터 & 정렬** — 지역, 생활비, 인터넷 속도, KTX, 바다 필터 + 6가지 정렬 옵션
- **도시 상세** — 12개 지표 점수, 생활비 내역, 코워킹, 리뷰, 장단점, 날씨, 사진, 주변 도시 (8개 탭)
- **도시 비교** — 최대 3개 도시를 나란히 비교하는 테이블 뷰
- **리뷰 시스템** — 4단계 위저드 (기본정보 → 12개 항목 평가 → 장단점 태그 → 텍스트 리뷰)
- **투표 기능** — 리뷰 도움됐어요/안됐어요 토글
- **회원 시스템** — 이메일 회원가입/로그인, 접근 제어 (비회원: 리뷰 3개 제한)
- **워케이션 프로그램** — 지자체 워케이션 지원사업 및 밋업 정보

## 대상 도시 (30개)

| 카테고리 | 도시 |
|----------|------|
| 대도시 (8) | 서울, 부산, 대구, 인천, 광주, 대전, 울산, 세종 |
| 워케이션 인기 (8) | 제주, 서귀포, 강릉, 속초, 여수, 전주, 경주, 통영 |
| 중소도시 (9) | 춘천, 원주, 천안, 청주, 목포, 순천, 포항, 안동, 군산 |
| 수도권 위성 (5) | 판교, 수원, 용인, 고양, 파주 |

## 12개 평가 지표

인터넷, 생활비, 교통, 코워킹, 안전, 먹거리, 자연환경, 문화, 의료, 편의시설, 커뮤니티, 주거

## 프로젝트 구조

```
k-nomad/
├── app/
│   ├── page.tsx                        # 메인 (도시 카드 리스트)
│   ├── layout.tsx                      # 루트 레이아웃 (AuthProvider)
│   ├── cities/[slug]/page.tsx          # 도시 상세 (8개 탭)
│   ├── compare/page.tsx                # 도시 비교
│   ├── review/[slug]/page.tsx          # 리뷰 작성
│   ├── login/page.tsx                  # 로그인
│   ├── signup/page.tsx                 # 회원가입
│   ├── programs/page.tsx               # 워케이션 프로그램
│   ├── terms/page.tsx                  # 이용약관
│   ├── privacy/page.tsx                # 개인정보처리방침
│   ├── contact/page.tsx                # 문의하기
│   └── api/
│       ├── auth/[...nextauth]/route.ts # NextAuth 핸들러
│       ├── auth/signup/route.ts        # 회원가입 API
│       ├── cities/route.ts             # GET 도시 목록 (필터/정렬)
│       ├── cities/[slug]/route.ts      # GET 도시 상세
│       ├── cities/[slug]/reviews/      # POST 리뷰 작성
│       ├── cities/[slug]/coworkings/   # GET 코워킹
│       ├── cities/[slug]/nearby/       # GET 주변 도시
│       ├── cities/compare/route.ts     # GET 도시 비교
│       ├── reviews/[id]/vote/route.ts  # POST 리뷰 투표
│       ├── programs/route.ts           # GET 워케이션 프로그램
│       └── meetups/route.ts            # GET 밋업
├── components/
│   ├── home/                           # Hero, CityCard, CityGrid, FilterBar, Sidebar
│   ├── city/                           # CityHero, CityTabs, 8개 탭 컴포넌트
│   ├── compare/                        # CitySelector, ComparisonTable
│   ├── review/                         # ReviewForm (4단계 위저드)
│   ├── layout/                         # Header, Footer, MobileNav
│   ├── shared/                         # MetricBar, ScoreBadge, CityCardMini
│   ├── providers/                      # AuthProvider (SessionProvider)
│   └── ui/                             # shadcn/ui 컴포넌트
├── lib/
│   ├── data/
│   │   ├── index.ts                    # Prisma 쿼리 데이터 레이어
│   │   ├── mappers.ts                  # Prisma → TS 인터페이스 변환
│   │   ├── cities.ts                   # 도시 시드 데이터
│   │   ├── reviews.ts                  # 리뷰 시드 데이터
│   │   ├── coworkings.ts              # 코워킹 시드 데이터
│   │   └── programs.ts                # 프로그램/밋업 시드 데이터
│   ├── auth.ts                         # NextAuth 설정
│   ├── auth-utils.ts                   # getCurrentUser, getUserTier
│   ├── db.ts                           # Prisma Client 싱글턴
│   ├── types.ts                        # TypeScript 인터페이스
│   ├── constants.ts                    # 지표, 지역, 태그 상수
│   └── utils.ts                        # cn(), getScoreColor() 유틸
├── prisma/
│   ├── schema.prisma                   # DB 스키마 (15개 모델)
│   ├── seed.ts                         # 시드 스크립트
│   └── migrations/                     # 마이그레이션
└── types/
    └── next-auth.d.ts                  # NextAuth 타입 확장
```

## 설치 및 실행

```bash
git clone https://github.com/y2llowfox/k-nomad.git
cd k-nomad
npm install
```

### 환경변수 설정

`.env` 파일 생성:

```env
DATABASE_URL="file:./prisma/dev.db"
```

`.env.local` 파일 생성:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### DB 초기화 및 시딩

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 개발 서버

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### DB 관리 (Prisma Studio)

```bash
npx prisma studio
```

브라우저에서 `http://localhost:5555` 접속하여 데이터 직접 조회/수정 가능

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/cities` | 도시 목록 (필터: region, maxCost, minInternet, hasKTX, isSeaside, sort) |
| GET | `/api/cities/:slug` | 도시 상세 |
| GET | `/api/cities/:slug/coworkings` | 코워킹 목록 |
| GET | `/api/cities/:slug/nearby` | 주변 도시 |
| POST | `/api/cities/:slug/reviews` | 리뷰 작성 (인증 필요) |
| GET | `/api/cities/compare?slugs=a,b,c` | 도시 비교 |
| POST | `/api/reviews/:id/vote` | 리뷰 투표 (인증 필요) |
| GET | `/api/programs` | 워케이션 프로그램 |
| GET | `/api/meetups` | 밋업 목록 |
| POST | `/api/auth/signup` | 회원가입 |

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| UI | Tailwind CSS, shadcn/ui (Radix UI) |
| 데이터베이스 | SQLite (Prisma ORM) |
| 인증 | NextAuth.js v4 (Credentials + JWT) |
| 언어 | TypeScript |

## 라이선스

MIT License
