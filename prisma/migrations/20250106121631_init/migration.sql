/*
  Warnings:

  - You are about to drop the column `active` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `wait` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `privacy` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `privacy_profileId_key` ON `privacy`;

-- AlterTable
ALTER TABLE `friends` DROP COLUMN `active`,
    DROP COLUMN `wait`,
    ADD COLUMN `type` ENUM('active', 'inactive', 'waiting') NOT NULL DEFAULT 'waiting';

-- AlterTable
ALTER TABLE `privacy` DROP COLUMN `profileId`;

-- CreateIndex
CREATE INDEX `black_lists_userId_active_idx` ON `black_lists`(`userId`, `active`);

-- CreateIndex
CREATE INDEX `friends_user_id_vs_user_id_idx` ON `friends`(`user_id`, `vs_user_id`);

-- CreateIndex
CREATE INDEX `friends_type_idx` ON `friends`(`type`);
