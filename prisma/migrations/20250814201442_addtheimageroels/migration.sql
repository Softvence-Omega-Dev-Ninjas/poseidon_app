/*
  Warnings:

  - The `visibility` column on the `Image` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "Roles" NOT NULL DEFAULT 'supporter';

-- DropEnum
DROP TYPE "Visibility";
