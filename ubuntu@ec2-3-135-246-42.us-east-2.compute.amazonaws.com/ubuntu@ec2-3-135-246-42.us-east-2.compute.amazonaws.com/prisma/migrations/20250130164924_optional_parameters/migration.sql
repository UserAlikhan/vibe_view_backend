-- CreateEnum
CREATE TYPE "ROLES" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Bars" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "average_cocktail_price" DROP NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "reserve_link" DROP NOT NULL,
ALTER COLUMN "website_link" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" "ROLES" NOT NULL DEFAULT 'USER';
