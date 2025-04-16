/*
  Warnings:

  - You are about to drop the column `url` on the `BarsImages` table. All the data in the column will be lost.
  - Added the required column `image_name` to the `BarsImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BarsImages" DROP COLUMN "url",
ADD COLUMN     "image_name" TEXT NOT NULL,
ADD COLUMN     "isCoverImage" BOOLEAN NOT NULL DEFAULT false;
