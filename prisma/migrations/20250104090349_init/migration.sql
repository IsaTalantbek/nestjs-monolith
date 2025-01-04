-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `profiles` DROP FOREIGN KEY `profiles_privacyId_fkey`;

-- DropIndex
DROP INDEX `accounts_profileId_fkey` ON `accounts`;

-- DropIndex
DROP INDEX `profiles_privacyId_fkey` ON `profiles`;

-- AlterTable
ALTER TABLE `accounts` MODIFY `profileId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `profiles` MODIFY `ownerId` VARCHAR(191) NULL,
    MODIFY `privacyId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_privacyId_fkey` FOREIGN KEY (`privacyId`) REFERENCES `Privacy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
