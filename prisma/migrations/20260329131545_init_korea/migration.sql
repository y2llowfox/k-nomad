-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "nickname" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "profession" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "monthlyCost" DOUBLE PRECISION NOT NULL,
    "internetSpeed" DOUBLE PRECISION NOT NULL,
    "currentTemp" DOUBLE PRECISION NOT NULL,
    "weatherIcon" TEXT NOT NULL,
    "hasKTX" BOOLEAN NOT NULL,
    "isSeaside" BOOLEAN NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "environment" JSONB NOT NULL DEFAULT '[]',
    "bestSeason" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "City_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "CityVote" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "CityVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityMetric" (
    "id" SERIAL NOT NULL,
    "citySlug" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "detail" TEXT,

    CONSTRAINT "CityMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostItem" (
    "id" SERIAL NOT NULL,
    "citySlug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "CostItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityHighlight" (
    "id" SERIAL NOT NULL,
    "citySlug" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "CityHighlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProConTag" (
    "id" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProConTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyWeather" (
    "id" SERIAL NOT NULL,
    "citySlug" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "avgTemp" DOUBLE PRECISION NOT NULL,
    "rainfall" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MonthlyWeather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityPhoto" (
    "id" SERIAL NOT NULL,
    "citySlug" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "CityPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityNearby" (
    "id" SERIAL NOT NULL,
    "fromSlug" TEXT NOT NULL,
    "toSlug" TEXT NOT NULL,

    CONSTRAINT "CityNearby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoworkingSpace" (
    "id" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dailyPrice" INTEGER NOT NULL,
    "monthlyPrice" INTEGER,
    "amenities" JSONB NOT NULL DEFAULT '[]',
    "hours" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "CoworkingSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL,
    "authorId" TEXT,
    "authorNickname" TEXT NOT NULL,
    "visitPeriod" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "unhelpful" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewVote" (
    "id" SERIAL NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ReviewVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkationProgram" (
    "id" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "subsidy" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "WorkationProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meetup" (
    "id" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "attendees" INTEGER NOT NULL,

    CONSTRAINT "Meetup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "City_likes_idx" ON "City"("likes");

-- CreateIndex
CREATE INDEX "City_region_idx" ON "City"("region");

-- CreateIndex
CREATE INDEX "City_monthlyCost_idx" ON "City"("monthlyCost");

-- CreateIndex
CREATE UNIQUE INDEX "CityVote_userId_citySlug_key" ON "CityVote"("userId", "citySlug");

-- CreateIndex
CREATE UNIQUE INDEX "CityMetric_citySlug_key_key" ON "CityMetric"("citySlug", "key");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyWeather_citySlug_month_key" ON "MonthlyWeather"("citySlug", "month");

-- CreateIndex
CREATE UNIQUE INDEX "CityNearby_fromSlug_toSlug_key" ON "CityNearby"("fromSlug", "toSlug");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewVote_reviewId_userId_key" ON "ReviewVote"("reviewId", "userId");

-- AddForeignKey
ALTER TABLE "CityVote" ADD CONSTRAINT "CityVote_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityVote" ADD CONSTRAINT "CityVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityMetric" ADD CONSTRAINT "CityMetric_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostItem" ADD CONSTRAINT "CostItem_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityHighlight" ADD CONSTRAINT "CityHighlight_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProConTag" ADD CONSTRAINT "ProConTag_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyWeather" ADD CONSTRAINT "MonthlyWeather_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityPhoto" ADD CONSTRAINT "CityPhoto_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityNearby" ADD CONSTRAINT "CityNearby_fromSlug_fkey" FOREIGN KEY ("fromSlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityNearby" ADD CONSTRAINT "CityNearby_toSlug_fkey" FOREIGN KEY ("toSlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoworkingSpace" ADD CONSTRAINT "CoworkingSpace_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewVote" ADD CONSTRAINT "ReviewVote_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewVote" ADD CONSTRAINT "ReviewVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkationProgram" ADD CONSTRAINT "WorkationProgram_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meetup" ADD CONSTRAINT "Meetup_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
