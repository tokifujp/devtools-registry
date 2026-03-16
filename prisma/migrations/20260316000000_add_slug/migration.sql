-- Add slug column
ALTER TABLE "Tool" ADD COLUMN "slug" TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");
