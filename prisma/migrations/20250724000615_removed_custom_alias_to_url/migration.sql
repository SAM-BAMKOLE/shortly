/*
  Warnings:

  - You are about to drop the column `customAlias` on the `urls` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_urls" (
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
INSERT INTO "new_urls" ("createdAt", "creatorId", "description", "expiresAt", "id", "originalUrl", "shortUrl", "status", "tags", "title", "totalClicks", "uniqueClicks", "updatedAt") SELECT "createdAt", "creatorId", "description", "expiresAt", "id", "originalUrl", "shortUrl", "status", "tags", "title", "totalClicks", "uniqueClicks", "updatedAt" FROM "urls";
DROP TABLE "urls";
ALTER TABLE "new_urls" RENAME TO "urls";
CREATE UNIQUE INDEX "urls_shortUrl_key" ON "urls"("shortUrl");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
