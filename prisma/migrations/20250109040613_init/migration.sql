/*
  Warnings:

  - You are about to drop the column `sessionId` on the `session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Session_sessionId_key` ON `session`;

-- AlterTable
ALTER TABLE `session` DROP COLUMN `sessionId`;
