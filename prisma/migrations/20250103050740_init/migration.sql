/*
  Warnings:

  - Made the column `update_at` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_by` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_at` on table `black_list` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_by` on table `black_list` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_at` on table `like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_at` on table `post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_by` on table `post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_at` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_by` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `accounts` MODIFY `create_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    MODIFY `update_at` DATETIME(3) NOT NULL,
    MODIFY `update_by` VARCHAR(191) NOT NULL DEFAULT 'System';

-- AlterTable
ALTER TABLE `black_list` MODIFY `create_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    MODIFY `update_at` DATETIME(3) NOT NULL,
    MODIFY `update_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    MODIFY `active` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `like` MODIFY `create_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    MODIFY `update_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `post` MODIFY `create_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    MODIFY `update_at` DATETIME(3) NOT NULL,
    MODIFY `update_by` VARCHAR(191) NOT NULL DEFAULT 'System';

-- AlterTable
ALTER TABLE `profiles` MODIFY `create_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    MODIFY `update_at` DATETIME(3) NOT NULL,
    MODIFY `update_by` VARCHAR(191) NOT NULL DEFAULT 'System';

-- AlterTable
ALTER TABLE `tags` ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `create_by` VARCHAR(191) NOT NULL DEFAULT 'System';
