/*
  Warnings:

  - You are about to drop the column `fingerprint` on the `clicks` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `clicks` table. All the data in the column will be lost.
  - You are about to drop the column `referrerType` on the `clicks` table. All the data in the column will be lost.
  - You are about to drop the column `screenHeight` on the `clicks` table. All the data in the column will be lost.
  - You are about to drop the column `screenWidth` on the `clicks` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueClicks` on the `daily_stats` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clicks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "urlId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "browser" TEXT,
    "referrer" TEXT,
    CONSTRAINT "clicks_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "urls" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_clicks" ("browser", "city", "country", "deviceType", "id", "ipAddress", "referrer", "region", "timestamp", "urlId", "userAgent") SELECT "browser", "city", "country", "deviceType", "id", "ipAddress", "referrer", "region", "timestamp", "urlId", "userAgent" FROM "clicks";
DROP TABLE "clicks";
ALTER TABLE "new_clicks" RENAME TO "clicks";
CREATE INDEX "clicks_urlId_idx" ON "clicks"("urlId");
CREATE INDEX "clicks_timestamp_idx" ON "clicks"("timestamp");
CREATE INDEX "clicks_urlId_timestamp_idx" ON "clicks"("urlId", "timestamp");
CREATE TABLE "new_daily_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "urlId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "geographicData" TEXT,
    "deviceData" TEXT,
    "referrerData" TEXT,
    "hourlyData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "daily_stats_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "urls" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_daily_stats" ("createdAt", "date", "deviceData", "geographicData", "hourlyData", "id", "referrerData", "totalClicks", "updatedAt", "urlId") SELECT "createdAt", "date", "deviceData", "geographicData", "hourlyData", "id", "referrerData", "totalClicks", "updatedAt", "urlId" FROM "daily_stats";
DROP TABLE "daily_stats";
ALTER TABLE "new_daily_stats" RENAME TO "daily_stats";
CREATE INDEX "daily_stats_urlId_idx" ON "daily_stats"("urlId");
CREATE INDEX "daily_stats_date_idx" ON "daily_stats"("date");
CREATE UNIQUE INDEX "daily_stats_urlId_date_key" ON "daily_stats"("urlId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
