/*
  Warnings:

  - You are about to drop the column `userId` on the `black_lists` table. All the data in the column will be lost.
  - You are about to drop the column `vsProfileId` on the `black_lists` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `privacy` table. All the data in the column will be lost.
  - You are about to drop the column `subscribe` on the `privacy` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `ratio` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `subscribers` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[initAid,vsPid]` on the table `black_lists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[initAid,postId,type]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[statsId]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `initAid` to the `black_lists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vsPid` to the `black_lists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initAid` to the `likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statsId` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `black_lists` DROP FOREIGN KEY `black_lists_userId_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_userId_fkey`;

-- DropIndex
DROP INDEX `black_lists_userId_active_idx` ON `black_lists`;

-- DropIndex
DROP INDEX `black_lists_userId_vsProfileId_key` ON `black_lists`;

-- DropIndex
DROP INDEX `likes_userId_postId_type_key` ON `likes`;

-- AlterTable
ALTER TABLE `black_lists` DROP COLUMN `userId`,
    DROP COLUMN `vsProfileId`,
    ADD COLUMN `initAid` VARCHAR(191) NOT NULL,
    ADD COLUMN `vsPid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `likes` DROP COLUMN `userId`,
    ADD COLUMN `initAid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `privacy` DROP COLUMN `like`,
    DROP COLUMN `subscribe`,
    ADD COLUMN `likes` ENUM('all', 'friends', 'nobody') NOT NULL DEFAULT 'all',
    ADD COLUMN `subscriptions` ENUM('all', 'friends', 'nobody') NOT NULL DEFAULT 'all';

-- AlterTable
ALTER TABLE `profiles` DROP COLUMN `dislikes`,
    DROP COLUMN `likes`,
    DROP COLUMN `ratio`,
    DROP COLUMN `subscribers`,
    ADD COLUMN `statsId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `statsProfile` (
    `id` VARCHAR(191) NOT NULL,
    `subscribers` INTEGER NOT NULL DEFAULT 0,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `dislikes` INTEGER NOT NULL DEFAULT 0,
    `ratio` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `black_lists_initAid_active_idx` ON `black_lists`(`initAid`, `active`);

-- CreateIndex
CREATE UNIQUE INDEX `black_lists_initAid_vsPid_key` ON `black_lists`(`initAid`, `vsPid`);

-- CreateIndex
CREATE UNIQUE INDEX `likes_initAid_postId_type_key` ON `likes`(`initAid`, `postId`, `type`);

-- CreateIndex
CREATE UNIQUE INDEX `profiles_statsId_key` ON `profiles`(`statsId`);

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_statsId_fkey` FOREIGN KEY (`statsId`) REFERENCES `statsProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_initAid_fkey` FOREIGN KEY (`initAid`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `black_lists` ADD CONSTRAINT `black_lists_initAid_fkey` FOREIGN KEY (`initAid`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
