/*
  Warnings:

  - The values [AGENT,SUPER_ADMIN] on the enum `SupportChat_sender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `supportchat` MODIFY `sender` ENUM('USER', 'ADMIN') NOT NULL;
