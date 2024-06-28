/*
  Warnings:

  - You are about to drop the `UploadImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'VIDEO', 'OTHER');

-- DropForeignKey
ALTER TABLE "UploadImage" DROP CONSTRAINT "UploadImage_userId_fkey";

-- DropTable
DROP TABLE "UploadImage";

-- CreateTable
CREATE TABLE "UploadFile" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL DEFAULT 'OTHER',
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UploadFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UploadFile" ADD CONSTRAINT "UploadFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
