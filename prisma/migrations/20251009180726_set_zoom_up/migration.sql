-- CreateEnum
CREATE TYPE "SchedulType" AS ENUM ('membership', 'service', 'supportercard');

-- CreateTable
CREATE TABLE "ScheduledEvent" (
    "id" TEXT NOT NULL,
    "utm_term_userId" TEXT NOT NULL,
    "salesforce_uuid_bergirlId" TEXT NOT NULL,
    "schedulType_utm_source" "SchedulType" NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "join_url" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "membershipTbId_utm_medium" TEXT,
    "serviceOrderTbId_utm_medium" TEXT,

    CONSTRAINT "ScheduledEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledEvent_id_key" ON "ScheduledEvent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledEvent_membershipTbId_utm_medium_key" ON "ScheduledEvent"("membershipTbId_utm_medium");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledEvent_serviceOrderTbId_utm_medium_key" ON "ScheduledEvent"("serviceOrderTbId_utm_medium");

-- AddForeignKey
ALTER TABLE "ScheduledEvent" ADD CONSTRAINT "ScheduledEvent_utm_term_userId_fkey" FOREIGN KEY ("utm_term_userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledEvent" ADD CONSTRAINT "ScheduledEvent_salesforce_uuid_bergirlId_fkey" FOREIGN KEY ("salesforce_uuid_bergirlId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledEvent" ADD CONSTRAINT "ScheduledEvent_membershipTbId_utm_medium_fkey" FOREIGN KEY ("membershipTbId_utm_medium") REFERENCES "PermissionVideoCallAccess"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledEvent" ADD CONSTRAINT "ScheduledEvent_serviceOrderTbId_utm_medium_fkey" FOREIGN KEY ("serviceOrderTbId_utm_medium") REFERENCES "ServiceOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
