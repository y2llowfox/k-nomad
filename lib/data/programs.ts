import { WorkationProgram, Meetup } from "@/lib/types";

export const programs: WorkationProgram[] = [
  {
    id: "wp-1",
    title: "제주 디지털 노마드 워케이션",
    city: "jeju",
    period: "2026년 4월 1일 ~ 4월 30일",
    subsidy: "숙박비 50% 지원 (최대 50만원)",
    description:
      "제주 창조경제혁신센터에서 운영하는 한 달 워케이션 프로그램입니다. 코워킹 스페이스 무료 이용, 네트워킹 행사, 지역 투어가 포함되어 있습니다.",
  },
  {
    id: "wp-2",
    title: "강릉 바다 워케이션 시즌3",
    city: "gangneung",
    period: "2026년 5월 12일 ~ 6월 8일",
    subsidy: "코워킹 무료 + 숙박비 30만원 지원",
    description:
      "경포 해변 인근 코워킹 스페이스에서 4주간 진행되는 워케이션 프로그램입니다. 서핑 체험, 커피 투어, 로컬 네트워킹이 포함됩니다.",
  },
  {
    id: "wp-3",
    title: "전주 한옥 크리에이터 캠프",
    city: "jeonju",
    period: "2026년 6월 1일 ~ 6월 28일",
    subsidy: "한옥 숙소 무료 제공 (4주)",
    description:
      "전주 한옥마을에서 진행되는 크리에이터 대상 워케이션입니다. 전통 문화 체험, 먹거리 투어, 콘텐츠 제작 워크숍이 포함됩니다.",
  },
  {
    id: "wp-4",
    title: "부산 해운대 스타트업 워케이션",
    city: "busan",
    period: "2026년 7월 7일 ~ 8월 1일",
    subsidy: "코워킹 무료 + 교통비 20만원 지원",
    description:
      "센텀시티 코워킹 허브에서 진행되는 스타트업 워케이션입니다. 멘토링, 투자 연계, BIFF 사전 네트워킹 프로그램이 포함됩니다.",
  },
  {
    id: "wp-5",
    title: "여수 힐링 워케이션",
    city: "yeosu",
    period: "2026년 9월 15일 ~ 10월 12일",
    subsidy: "숙박비 40만원 + 식비 20만원 지원",
    description:
      "여수 밤바다를 즐기며 일하는 힐링 워케이션입니다. 섬 투어, 해양 레저, 지역 음식 체험이 포함됩니다.",
  },
];

export const meetups: Meetup[] = [
  {
    id: "mu-1",
    date: "2026-04-05",
    city: "jeju",
    title: "제주 노마드 네트워킹 밋업 #42",
    attendees: 35,
  },
  {
    id: "mu-2",
    date: "2026-04-12",
    city: "seoul",
    title: "서울 디지털 노마드 커피챗",
    attendees: 48,
  },
  {
    id: "mu-3",
    date: "2026-04-19",
    city: "busan",
    title: "부산 해변 코워킹 데이",
    attendees: 22,
  },
  {
    id: "mu-4",
    date: "2026-04-26",
    city: "gangneung",
    title: "강릉 카페 호핑 밋업",
    attendees: 15,
  },
  {
    id: "mu-5",
    date: "2026-05-03",
    city: "jeonju",
    title: "전주 한옥마을 런치 밋업",
    attendees: 18,
  },
  {
    id: "mu-6",
    date: "2026-05-10",
    city: "seoul",
    title: "서울 프리랜서 네트워킹 나이트",
    attendees: 62,
  },
];
