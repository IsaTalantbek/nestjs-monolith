/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `Privacy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[privacyId]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_profileId_fkey`;

-- DropIndex
DROP INDEX `accounts_profileId_fkey` ON `accounts`;

-- AlterTable
ALTER TABLE `privacy` MODIFY `profileId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Privacy_profileId_key` ON `Privacy`(`profileId`);

-- CreateIndex
CREATE UNIQUE INDEX `profiles_privacyId_key` ON `profiles`(`privacyId`);

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
