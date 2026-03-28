-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "nickname" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "profession" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "City" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "overallScore" REAL NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "monthlyCost" REAL NOT NULL,
    "internetSpeed" REAL NOT NULL,
    "currentTemp" REAL NOT NULL,
    "weatherIcon" TEXT NOT NULL,
    "hasKTX" BOOLEAN NOT NULL,
    "isSeaside" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "CityMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "citySlug" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "detail" TEXT,
    CONSTRAINT "CityMetric_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CostItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "citySlug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    CONSTRAINT "CostItem_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CityHighlight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "citySlug" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "CityHighlight_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProConTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citySlug" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProConTag_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonthlyWeather" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "citySlug" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "avgTemp" REAL NOT NULL,
    "rainfall" REAL NOT NULL,
    "humidity" REAL NOT NULL,
    CONSTRAINT "MonthlyWeather_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CityPhoto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "citySlug" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    CONSTRAINT "CityPhoto_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CityNearby" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromSlug" TEXT NOT NULL,
    "toSlug" TEXT NOT NULL,
    CONSTRAINT "CityNearby_fromSlug_fkey" FOREIGN KEY ("fromSlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CityNearby_toSlug_fkey" FOREIGN KEY ("toSlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoworkingSpace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citySlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dailyPrice" INTEGER NOT NULL,
    "monthlyPrice" INTEGER,
    "amenities" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    CONSTRAINT "CoworkingSpace_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citySlug" TEXT NOT NULL,
    "authorId" TEXT,
    "authorNickname" TEXT NOT NULL,
    "visitPeriod" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "overallScore" REAL NOT NULL,
    "text" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "unhelpful" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewVote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "ReviewVote_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkationProgram" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citySlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "subsidy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "WorkationProgram_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Meetup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citySlug" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "attendees" INTEGER NOT NULL,
    CONSTRAINT "Meetup_citySlug_fkey" FOREIGN KEY ("citySlug") REFERENCES "City" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "CityMetric_citySlug_key_key" ON "CityMetric"("citySlug", "key");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyWeather_citySlug_month_key" ON "MonthlyWeather"("citySlug", "month");

-- CreateIndex
CREATE UNIQUE INDEX "CityNearby_fromSlug_toSlug_key" ON "CityNearby"("fromSlug", "toSlug");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewVote_reviewId_userId_key" ON "ReviewVote"("reviewId", "userId");
