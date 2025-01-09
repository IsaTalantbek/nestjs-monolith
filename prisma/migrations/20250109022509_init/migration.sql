/*
  Warnings:

  - Added the required column `headers` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ipAdress` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accounts` MODIFY `accountUI` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `session` ADD COLUMN `headers` VARCHAR(191) NOT NULL,
    ADD COLUMN `ipAdress` VARCHAR(191) NOT NULL;
