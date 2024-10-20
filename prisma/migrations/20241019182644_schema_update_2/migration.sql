-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_seriesId_fkey";

-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "seriesId" DROP NOT NULL,
ALTER COLUMN "seriesId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;
