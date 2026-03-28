import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getWorkationPrograms, getMeetups } from "@/lib/data";

export default async function Sidebar() {
  const programs = await getWorkationPrograms();
  const meetups = await getMeetups();

  return (
    <aside className="hidden lg:block w-[280px] shrink-0 space-y-4">
      {/* Workation Program */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">📢 워케이션 프로그램</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {programs.slice(0, 2).map((program) => (
            <div key={program.id} className="space-y-1">
              <p className="text-sm font-medium">{program.title}</p>
              <p className="text-xs text-muted-foreground">
                {program.city} · {program.period}
              </p>
              <p className="text-xs text-red-500 font-medium">
                {program.subsidy}
              </p>
            </div>
          ))}
          <Link href="/programs">
            <Button variant="outline" size="sm" className="w-full text-xs">
              자세히 보기 →
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Meetups */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            🤝 다음 밋업 (월 {meetups.length}회)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {meetups.slice(0, 3).map((meetup) => (
            <div key={meetup.id} className="space-y-1">
              <p className="text-sm font-medium">{meetup.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {meetup.date} · {meetup.city}
                </span>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  {meetup.attendees}명 참석
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Currently Traveling */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">📍 지금 여행 중 (24명)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs"
              >
                👤
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Pick */}
      <Link href="/cities/jeonju">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">🏆 오늘의 추천</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="h-32 rounded-lg bg-cover bg-center relative mb-2"
              style={{
                backgroundImage: `url(https://picsum.photos/seed/daily-pick/400/200)`,
              }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-end p-3">
                <p className="text-white text-sm font-medium">
                  봄에 가기 좋은 전주 한옥마을
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">326회 조회</p>
          </CardContent>
        </Card>
      </Link>

      <Separator />

      {/* CTA */}
      <Card className="bg-slate-900 text-white">
        <CardContent className="pt-6 text-center space-y-3">
          <p className="text-sm">
            🌍 원격근무자 커뮤니티에
            <br />
            참여하세요
          </p>
          <Link href="/signup">
            <Button className="w-full bg-red-500 hover:bg-red-600" size="sm">
              K-Nomad 가입하기
            </Button>
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}
