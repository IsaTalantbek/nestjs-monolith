/*
  Warnings:

  - The primary key for the `accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[profileId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `accounts` DROP PRIMARY KEY,
    ADD COLUMN `create_by` VARCHAR(191) NULL,
    ADD COLUMN `delete_by` VARCHAR(191) NULL,
    ADD COLUMN `profileId` VARCHAR(191) NULL,
    ADD COLUMN `update_by` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `profile_type` ENUM('personal', 'readers_community', 'authors_community', 'authors_union') NOT NULL DEFAULT 'readers_community',
    `profile_state` ENUM('created', 'activated', 'deleted', 'banned') NOT NULL DEFAULT 'created',
    `city_id` VARCHAR(191) NULL,
    `avatar_image_id` VARCHAR(191) NULL,
    `cover_image_id` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `display_name` VARCHAR(191) NULL,
    `verification_info` JSON NULL,
    `short_info` JSON NULL,
    `extra_info` JSON NULL,
    `other_links` JSON NULL,
    `create_at` DATETIME(3) NULL,
    `create_by` VARCHAR(191) NULL,
    `update_at` DATETIME(3) NULL,
    `update_by` VARCHAR(191) NULL,
    `delete_at` DATETIME(3) NULL,
    `delete_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `accounts_profileId_key` ON `accounts`(`profileId`);

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
