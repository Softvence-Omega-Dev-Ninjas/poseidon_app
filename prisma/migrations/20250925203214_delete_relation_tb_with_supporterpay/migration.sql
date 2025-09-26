-- DropForeignKey
ALTER TABLE "oder_package_name" DROP CONSTRAINT "oder_package_name_supporter_pay_id_fkey";

-- AddForeignKey
ALTER TABLE "oder_package_name" ADD CONSTRAINT "oder_package_name_supporter_pay_id_fkey" FOREIGN KEY ("supporter_pay_id") REFERENCES "SupporterPay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
