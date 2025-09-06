-- CreateTable
CREATE TABLE "ZoomAccount" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "zoomUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "apiBase" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZoomAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZoomAccount_providerId_key" ON "ZoomAccount"("providerId");

-- AddForeignKey
ALTER TABLE "ZoomAccount" ADD CONSTRAINT "ZoomAccount_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
