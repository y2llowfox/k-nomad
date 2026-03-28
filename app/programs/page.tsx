import { getWorkationPrograms, getMeetups } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProgramsPage() {
  const [programs, meetups] = await Promise.all([
    getWorkationPrograms(),
    getMeetups(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">워케이션 프로그램</h1>
      <p className="text-muted-foreground mb-8">
        지자체 및 기관에서 운영하는 워케이션 지원 프로그램을 확인하세요
      </p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">📢 진행 중인 프로그램</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {programs.map((program) => (
            <Card key={program.id}>
              <CardHeader>
                <CardTitle className="text-base">{program.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {program.city} · {program.period}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-red-500 font-medium">
                  {program.subsidy}
                </p>
                <p className="text-sm text-muted-foreground">
                  {program.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">🤝 예정된 밋업</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {meetups.map((meetup) => (
            <Card key={meetup.id}>
              <CardContent className="pt-4">
                <p className="font-medium text-sm">{meetup.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {meetup.date} · {meetup.city}
                  </span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    {meetup.attendees}명 참석
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
