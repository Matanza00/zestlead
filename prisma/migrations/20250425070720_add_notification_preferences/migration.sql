-- AlterTable
ALTER TABLE `user` ADD COLUMN `inAppNotification` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notifyPayment` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notifySubscription` BOOLEAN NOT NULL DEFAULT true;
