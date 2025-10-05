-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'RESCHEDULED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RescheduleStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "supporterId" TEXT NOT NULL,
    "requestedTime" TIMESTAMP(3) NOT NULL,
    "confirmedTime" TIMESTAMP(3),
    "status" "AppointmentStatus" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RescheduleRequest" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "suggestedTime" TIMESTAMP(3) NOT NULL,
    "suggestedBy" "Roles" NOT NULL,
    "status" "RescheduleStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RescheduleRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAvailability" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_id_key" ON "Appointment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserAvailability_id_key" ON "UserAvailability"("id");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RescheduleRequest" ADD CONSTRAINT "RescheduleRequest_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAvailability" ADD CONSTRAINT "UserAvailability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
