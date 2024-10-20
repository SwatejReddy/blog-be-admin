-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Series" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
