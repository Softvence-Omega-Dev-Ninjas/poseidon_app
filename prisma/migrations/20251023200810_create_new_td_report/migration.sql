-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "report_username" TEXT NOT NULL,
    "report_type" TEXT NOT NULL,
    "report_description" TEXT NOT NULL,
    "report_relevant_link" TEXT,
    "report_relevant_link2" TEXT,
    "report_relevant_file" TEXT,
    "report_created_email" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_report_username_fkey" FOREIGN KEY ("report_username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
