-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "postGuid" INTEGER NOT NULL,
    "ip" INET NOT NULL,
    "reason" VARCHAR(255),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_postGuid_fkey" FOREIGN KEY ("postGuid") REFERENCES "Post"("guid") ON DELETE CASCADE ON UPDATE CASCADE;
