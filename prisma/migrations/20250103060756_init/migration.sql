-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
