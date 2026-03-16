/*
  Warnings:

  - Made the column `slug` on table `Tool` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "officialSite" TEXT,
    "githubUrl" TEXT,
    "description" TEXT NOT NULL,
    "installations" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Tool" ("category", "createdAt", "description", "githubUrl", "id", "installations", "name", "notes", "officialSite", "slug", "tags", "updatedAt", "usage") SELECT "category", "createdAt", "description", "githubUrl", "id", "installations", "name", "notes", "officialSite", "slug", "tags", "updatedAt", "usage" FROM "Tool";
DROP TABLE "Tool";
ALTER TABLE "new_Tool" RENAME TO "Tool";
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");
CREATE INDEX "Tool_name_idx" ON "Tool"("name");
CREATE INDEX "Tool_category_idx" ON "Tool"("category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
