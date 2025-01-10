/*
  Warnings:

  - Added the required column `ipAdressFull` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `session` ADD COLUMN `ipAdressFull` VARCHAR(191) NOT NULL;
