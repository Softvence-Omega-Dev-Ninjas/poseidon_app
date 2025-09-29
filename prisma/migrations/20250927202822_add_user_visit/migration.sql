-- CreateTable
CREATE TABLE "UserVisit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserVisit_visitDate_idx" ON "UserVisit"("visitDate");

-- CreateIndex
CREATE UNIQUE INDEX "UserVisit_userId_visitDate_key" ON "UserVisit"("userId", "visitDate");

-- AddForeignKey
ALTER TABLE "UserVisit" ADD CONSTRAINT "UserVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
