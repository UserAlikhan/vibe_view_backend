/*
  Warnings:

  - You are about to drop the column `isLiveFeedAvailable` on the `Bars` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bars" DROP COLUMN "isLiveFeedAvailable";

-- CreateTable
CREATE TABLE "CameraUrls" (
    "Id" SERIAL NOT NULL,
    "bar_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CameraUrls_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "CameraUrls" ADD CONSTRAINT "CameraUrls_bar_id_fkey" FOREIGN KEY ("bar_id") REFERENCES "Bars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
