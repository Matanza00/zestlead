/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tierName` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subscription` ADD COLUMN `tierName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Subscription_userId_key` ON `Subscription`(`userId`);
