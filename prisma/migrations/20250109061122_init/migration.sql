/*
  Warnings:

  - You are about to drop the column `super` on the `session` table. All the data in the column will be lost.
  - Added the required column `superUser` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `session` DROP COLUMN `super`,
    ADD COLUMN `superUser` BOOLEAN NOT NULL;
