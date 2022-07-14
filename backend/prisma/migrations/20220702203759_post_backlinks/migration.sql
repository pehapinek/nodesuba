-- CreateTable
CREATE TABLE "PostBacklink" (
    "postGuid" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "postParentId" INTEGER,
    "postBoardId" TEXT NOT NULL,
    "linkedByGuid" INTEGER NOT NULL,
    "linkedById" INTEGER NOT NULL,
    "linkedByParentId" INTEGER,
    "linkedByBoardId" TEXT NOT NULL,

    CONSTRAINT "PostBacklink_pkey" PRIMARY KEY ("postGuid","linkedByGuid")
);

-- AddForeignKey
ALTER TABLE "PostBacklink" ADD CONSTRAINT "PostBacklink_postGuid_fkey" FOREIGN KEY ("postGuid") REFERENCES "Post"("guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostBacklink" ADD CONSTRAINT "PostBacklink_linkedByGuid_fkey" FOREIGN KEY ("linkedByGuid") REFERENCES "Post"("guid") ON DELETE RESTRICT ON UPDATE CASCADE;
