-- AlterTable
ALTER TABLE `blacklist` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `delete_by` VARCHAR(191) NULL,
    ADD COLUMN `update_at` DATETIME(3) NULL,
    ADD COLUMN `update_by` VARCHAR(191) NULL;
