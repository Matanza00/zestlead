/*
  Warnings:

  - You are about to drop the column `specialReq` on the `lead` table. All the data in the column will be lost.
  - You are about to alter the column `paymentMethod` on the `lead` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `lead` DROP COLUMN `specialReq`,
    ADD COLUMN `appointment` VARCHAR(191) NULL,
    ADD COLUMN `askingPrice` DOUBLE NULL,
    ADD COLUMN `condition` VARCHAR(191) NULL,
    ADD COLUMN `marketValue` DOUBLE NULL,
    ADD COLUMN `parcelId` VARCHAR(191) NULL,
    ADD COLUMN `propertyAddress` VARCHAR(191) NULL,
    ADD COLUMN `propertySize` VARCHAR(191) NULL,
    ADD COLUMN `specialRequirements` VARCHAR(191) NULL,
    MODIFY `beds` DOUBLE NULL,
    MODIFY `baths` DOUBLE NULL,
    MODIFY `desireArea` VARCHAR(191) NULL,
    MODIFY `priceRange` VARCHAR(191) NULL,
    MODIFY `paymentMethod` ENUM('CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'CHECK', 'OTHER') NOT NULL,
    MODIFY `preApproved` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `timeline` VARCHAR(191) NULL,
    MODIFY `hasRealtor` BOOLEAN NOT NULL DEFAULT false;
