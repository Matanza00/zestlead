/*
  Warnings:

  - You are about to alter the column `paymentMethod` on the `lead` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(10))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `lead` MODIFY `paymentMethod` VARCHAR(191) NULL;
