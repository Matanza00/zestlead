/*
  Warnings:

  - Added the required column `stripeSubscriptionId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subscription` ADD COLUMN `stripeSubscriptionId` VARCHAR(191) NOT NULL;
