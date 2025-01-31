/*
  Warnings:

  - Added the required column `city` to the `Bars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Bars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Bars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Bars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Bars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Bars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Bars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bars" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BarsImages" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "bar_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarsImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BarsImages" ADD CONSTRAINT "BarsImages_bar_id_fkey" FOREIGN KEY ("bar_id") REFERENCES "Bars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
