-- CreateTable
CREATE TABLE `CrmConnection` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `provider` ENUM('AIRTABLE', 'HUBSPOT', 'SALESFORCE', 'ZAPIER', 'ZOHO', 'INSIGHTLY', 'APPTIVO') NOT NULL,
    `authType` ENUM('OAUTH', 'API_KEY') NOT NULL,
    `accessToken` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NULL,
    `instanceUrl` VARCHAR(191) NULL,
    `apiKey` VARCHAR(191) NULL,
    `apiKey2` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `fieldMapping` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CrmConnection_userId_provider_key`(`userId`, `provider`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CrmConnection` ADD CONSTRAINT `CrmConnection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
