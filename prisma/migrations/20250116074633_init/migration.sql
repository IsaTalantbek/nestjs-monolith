/*
  Warnings:

  - You are about to drop the column `messageId` on the `comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `comment` DROP COLUMN `messageId`,
    ADD COLUMN `commentId` VARCHAR(191) NULL;
