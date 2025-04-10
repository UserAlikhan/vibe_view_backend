-- DropForeignKey
ALTER TABLE "BarsImages" DROP CONSTRAINT "BarsImages_bar_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_bar_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_bar_id_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_user_id_fkey";

-- AddForeignKey
ALTER TABLE "BarsImages" ADD CONSTRAINT "BarsImages_bar_id_fkey" FOREIGN KEY ("bar_id") REFERENCES "Bars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_bar_id_fkey" FOREIGN KEY ("bar_id") REFERENCES "Bars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_bar_id_fkey" FOREIGN KEY ("bar_id") REFERENCES "Bars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
