-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GOD', 'ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
