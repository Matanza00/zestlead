/*
  Warnings:

  - You are about to drop the column `reply` on the `supportchat` table. All the data in the column will be lost.
  - Added the required column `sender` to the `SupportChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supportchat` DROP COLUMN `reply`,
    ADD COLUMN `sender` ENUM('AGENT', 'ADMIN', 'SUPER_ADMIN') NOT NULL;
