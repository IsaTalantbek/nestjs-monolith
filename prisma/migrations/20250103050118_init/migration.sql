/*
  Warnings:

  - Made the column `update_by` on table `like` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `like` MODIFY `update_by` VARCHAR(191) NOT NULL DEFAULT 'System';
