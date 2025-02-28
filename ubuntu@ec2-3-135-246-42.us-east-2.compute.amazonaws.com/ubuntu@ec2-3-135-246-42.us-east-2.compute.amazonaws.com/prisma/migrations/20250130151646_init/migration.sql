/*
  Warnings:

  - You are about to drop the column `availability` on the `Bars` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `Reviews` table. All the data in the column will be lost.
  - You are about to drop the column `googleAccount` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `FavoriteBars` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerk_id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `average_cocktail_price` to the `Bars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Bars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reserve_link` to the `Bars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website_link` to the `Bars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bar_id` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerk_id` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FavoriteBars" DROP CONSTRAINT "FavoriteBars_bar_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteBars" DROP CONSTRAINT "FavoriteBars_user_id_fkey";

-- AlterTable
ALTER TABLE "Bars" DROP COLUMN "availability",
ADD COLUMN     "average_cocktail_price" TEXT NOT NULL,
ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "reserve_link" TEXT NOT NULL,
ADD COLUMN     "website_link" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "grade",
ADD COLUMN     "bar_id" INTEGER NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.00,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "googleAccount",
ADD COLUMN     "clerk_id" INTEGER NOT NULL,
ADD COLUMN     "isGoogleAccount" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "FavoriteBars";

-- DropEnum
DROP TYPE "Availability";

-- CreateTable
CREATE TABLE "Favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bar_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_clerk_id_key" ON "Users"("clerk_id");

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_bar_id_fkey" FOREIGN KEY ("bar_id") REFERENCES "Bars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_bar_id_fkey" FOREIGN KEY ("bar_id") REFERENCES "Bars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
