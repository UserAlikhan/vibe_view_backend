/*
  Warnings:

  - The primary key for the `CameraUrls` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `CameraUrls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CameraUrls" DROP CONSTRAINT "CameraUrls_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CameraUrls_pkey" PRIMARY KEY ("id");
