-- CreateEnum
CREATE TYPE "BanType" AS ENUM ('IP', 'RANGE', 'ASN');

-- CreateTable
CREATE TABLE "Board" (
    "id" VARCHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "postsCounter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "guid" SERIAL NOT NULL,
    "id" INTEGER NOT NULL,
    "boardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bumpedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" INET NOT NULL,
    "name" VARCHAR(30),
    "email" VARCHAR(50),
    "passwordHash" VARCHAR(32) NOT NULL,
    "content" TEXT NOT NULL,
    "parentGuid" INTEGER,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isAntibumped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("guid")
);

-- CreateTable
CREATE TABLE "Ban" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "banType" "BanType" NOT NULL,
    "ip" INET,
    "range" INET,
    "asn" VARCHAR(20),
    "reason" VARCHAR(100) NOT NULL,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wordfilter" (
    "id" SERIAL NOT NULL,
    "input" VARCHAR(255) NOT NULL,
    "output" VARCHAR(255) NOT NULL,

    CONSTRAINT "Wordfilter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_boardId_id_key" ON "Post"("boardId", "id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentGuid_fkey" FOREIGN KEY ("parentGuid") REFERENCES "Post"("guid") ON DELETE SET NULL ON UPDATE CASCADE;
