/*
  Warnings:

  - You are about to drop the column `referrer` on the `clicks` table. All the data in the column will be lost.

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
    "referer" TEXT,
    CONSTRAINT "clicks_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "urls" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_clicks" ("browser", "city", "country", "deviceType", "id", "ipAddress", "region", "timestamp", "urlId", "userAgent") SELECT "browser", "city", "country", "deviceType", "id", "ipAddress", "region", "timestamp", "urlId", "userAgent" FROM "clicks";
DROP TABLE "clicks";
ALTER TABLE "new_clicks" RENAME TO "clicks";
CREATE INDEX "clicks_urlId_idx" ON "clicks"("urlId");
CREATE INDEX "clicks_timestamp_idx" ON "clicks"("timestamp");
CREATE INDEX "clicks_urlId_timestamp_idx" ON "clicks"("urlId", "timestamp");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
