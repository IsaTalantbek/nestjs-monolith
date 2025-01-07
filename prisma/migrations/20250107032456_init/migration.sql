/*
  Warnings:

  - Added the required column `updated_at` to the `statsProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `statsprofile` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    ADD COLUMN `deleted` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `deleted_by` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `updated_by` VARCHAR(191) NULL;
