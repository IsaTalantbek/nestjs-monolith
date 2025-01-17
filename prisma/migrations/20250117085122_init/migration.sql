/*
  Warnings:

  - You are about to alter the column `type` on the `likes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(10))`.

*/
-- AlterTable
ALTER TABLE `likes` MODIFY `type` ENUM('like', 'dislike') NOT NULL;
