-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "urls" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "creatorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "tags" TEXT,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "uniqueClicks" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "urls_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "clicks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "urlId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "os" TEXT,
    "browser" TEXT,
    "screenWidth" INTEGER,
    "screenHeight" INTEGER,
    "referrer" TEXT,
    "referrerType" TEXT,
    "fingerprint" TEXT,
    CONSTRAINT "clicks_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "urls" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "daily_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "urlId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "uniqueClicks" INTEGER NOT NULL DEFAULT 0,
    "geographicData" TEXT,
    "deviceData" TEXT,
    "referrerData" TEXT,
    "hourlyData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "daily_stats_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "urls" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "urls_shortUrl_key" ON "urls"("shortUrl");

-- CreateIndex
CREATE INDEX "clicks_urlId_idx" ON "clicks"("urlId");

-- CreateIndex
CREATE INDEX "clicks_timestamp_idx" ON "clicks"("timestamp");

-- CreateIndex
CREATE INDEX "clicks_urlId_timestamp_idx" ON "clicks"("urlId", "timestamp");

-- CreateIndex
CREATE INDEX "clicks_fingerprint_idx" ON "clicks"("fingerprint");

-- CreateIndex
CREATE INDEX "daily_stats_urlId_idx" ON "daily_stats"("urlId");

-- CreateIndex
CREATE INDEX "daily_stats_date_idx" ON "daily_stats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_stats_urlId_date_key" ON "daily_stats"("urlId", "date");
