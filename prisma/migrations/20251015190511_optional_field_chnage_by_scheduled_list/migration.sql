-- AlterTable
ALTER TABLE "ScheduledEvent" ADD COLUMN     "email" TEXT,
ALTER COLUMN "utm_term_userId" DROP NOT NULL;
