/*
  Warnings:

  - You are about to drop the column `isContributor` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailVerificationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[forgotPasswordToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'CONTRIBUTOR';
ALTER TYPE "Role" ADD VALUE 'MODERATOR';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isContributor",
ADD COLUMN     "avatarUrl" TEXT DEFAULT 'https://example.com/default-avatar.png',
ADD COLUMN     "bio" TEXT DEFAULT '',
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerificationTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "forgotPasswordToken" TEXT,
ADD COLUMN     "forgotPasswordTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "socialLinks" JSONB DEFAULT '{}',
ADD COLUMN     "websiteUrl" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerificationToken_key" ON "User"("emailVerificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_forgotPasswordToken_key" ON "User"("forgotPasswordToken");
