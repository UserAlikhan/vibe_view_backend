-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('OPEN', 'CLOSE');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "googleAccount" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bars" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "availability" "Availability" NOT NULL,

    CONSTRAINT "Bars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL DEFAULT 5.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteBars" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bar_id" INTEGER NOT NULL,

    CONSTRAINT "FavoriteBars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bars_name_key" ON "Bars"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bars_address_key" ON "Bars"("address");

-- AddForeignKey
ALTER TABLE "FavoriteBars" ADD CONSTRAINT "FavoriteBars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteBars" ADD CONSTRAINT "FavoriteBars_bar_id_fkey" FOREIGN KEY ("bar_id") REFERENCES "Bars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
