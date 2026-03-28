"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { City, Review, CoworkingSpace } from "@/lib/types";
import ScoresTab from "@/components/city/tabs/ScoresTab";
import CostTab from "@/components/city/tabs/CostTab";
import CoworkingTab from "@/components/city/tabs/CoworkingTab";
import ReviewsTab from "@/components/city/tabs/ReviewsTab";
import ProsConsTab from "@/components/city/tabs/ProsConsTab";
import WeatherTab from "@/components/city/tabs/WeatherTab";
import PhotosTab from "@/components/city/tabs/PhotosTab";
import NearbyTab from "@/components/city/tabs/NearbyTab";

interface CityTabsProps {
  city: City;
  reviews: Review[];
  coworkings: CoworkingSpace[];
  nearbyCities: City[];
  userTier?: "anonymous" | "free" | "premium";
}

const TABS = [
  { value: "scores", label: "점수" },
  { value: "cost", label: "생활비" },
  { value: "coworking", label: "코워킹" },
  { value: "reviews", label: "리뷰" },
  { value: "proscons", label: "장단점" },
  { value: "weather", label: "날씨" },
  { value: "photos", label: "사진" },
  { value: "nearby", label: "주변 도시" },
];

export default function CityTabs({
  city,
  reviews,
  coworkings,
  nearbyCities,
  userTier = "anonymous",
}: CityTabsProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs defaultValue="scores">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="shrink-0">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="scores" className="mt-6">
          <ScoresTab city={city} />
        </TabsContent>

        <TabsContent value="cost" className="mt-6">
          <CostTab costs={city.costs} monthlyCost={city.monthlyCost} />
        </TabsContent>

        <TabsContent value="coworking" className="mt-6">
          <CoworkingTab coworkings={coworkings} cityName={city.name} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewsTab reviews={reviews} citySlug={city.slug} userTier={userTier} />
        </TabsContent>

        <TabsContent value="proscons" className="mt-6">
          <ProsConsTab pros={city.pros} cons={city.cons} />
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <WeatherTab weather={city.weather} cityName={city.name} />
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <PhotosTab photos={city.photos} cityName={city.name} />
        </TabsContent>

        <TabsContent value="nearby" className="mt-6">
          <NearbyTab cities={nearbyCities} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
