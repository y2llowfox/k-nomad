import { notFound, redirect } from "next/navigation";
import { getCityBySlug } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth-utils";
import ReviewForm from "@/components/review/ReviewForm";

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const [city, user] = await Promise.all([
    getCityBySlug(slug),
    getCurrentUser(),
  ]);

  if (!city) {
    notFound();
  }

  if (!user) {
    redirect(`/login?callbackUrl=/review/${slug}`);
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">{city.name} 리뷰 작성</h1>
      <p className="text-muted-foreground mb-8">
        {city.name}에서의 경험을 공유해주세요
      </p>

      <ReviewForm cityName={city.name} citySlug={city.slug} />
    </main>
  );
}
