-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PortfolioItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'Sürücü Kursu',
    "bio" TEXT NOT NULL DEFAULT '[]',
    "link" TEXT NOT NULL DEFAULT '',
    "postsCount" INTEGER NOT NULL DEFAULT 120,
    "followers" TEXT NOT NULL DEFAULT '2.500',
    "following" INTEGER NOT NULL DEFAULT 75,
    "mockupImageUrl" TEXT NOT NULL DEFAULT '',
    "imagesJson" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PortfolioItem" ("clientName", "createdAt", "id", "mockupImageUrl", "order", "updatedAt") SELECT "clientName", "createdAt", "id", "mockupImageUrl", "order", "updatedAt" FROM "PortfolioItem";
DROP TABLE "PortfolioItem";
ALTER TABLE "new_PortfolioItem" RENAME TO "PortfolioItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
