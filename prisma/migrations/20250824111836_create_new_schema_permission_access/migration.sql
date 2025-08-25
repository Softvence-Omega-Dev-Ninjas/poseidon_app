-- CreateTable
CREATE TABLE "PermissionVideoCallAccess" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "supporter_id" TEXT NOT NULL,
    "totalVideoCalls" INTEGER NOT NULL,
    "unlimitedVideoCalls" BOOLEAN NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionVideoCallAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionMessagesAccess" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "supporter_id" TEXT NOT NULL,
    "totalMessages" INTEGER NOT NULL,
    "unlimitedMessages" BOOLEAN NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionMessagesAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionGalleryAccess" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "supporter_id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionGalleryAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionPostsAccess" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "supporter_id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionPostsAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PermissionVideoCallAccess_id_key" ON "PermissionVideoCallAccess"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionMessagesAccess_id_key" ON "PermissionMessagesAccess"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionGalleryAccess_id_key" ON "PermissionGalleryAccess"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionPostsAccess_id_key" ON "PermissionPostsAccess"("id");

-- AddForeignKey
ALTER TABLE "PermissionVideoCallAccess" ADD CONSTRAINT "PermissionVideoCallAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionVideoCallAccess" ADD CONSTRAINT "PermissionVideoCallAccess_supporter_id_fkey" FOREIGN KEY ("supporter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMessagesAccess" ADD CONSTRAINT "PermissionMessagesAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMessagesAccess" ADD CONSTRAINT "PermissionMessagesAccess_supporter_id_fkey" FOREIGN KEY ("supporter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionGalleryAccess" ADD CONSTRAINT "PermissionGalleryAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionGalleryAccess" ADD CONSTRAINT "PermissionGalleryAccess_supporter_id_fkey" FOREIGN KEY ("supporter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionPostsAccess" ADD CONSTRAINT "PermissionPostsAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionPostsAccess" ADD CONSTRAINT "PermissionPostsAccess_supporter_id_fkey" FOREIGN KEY ("supporter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
