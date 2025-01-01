-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `account_role` ENUM('owner', 'user', 'developer', 'moderator', 'support') NOT NULL DEFAULT 'user',
    `account_state` ENUM('created', 'activated', 'deleted', 'banned') NOT NULL DEFAULT 'created',
    `profileId` VARCHAR(191) NULL,
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `tfa_code` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `create_by` VARCHAR(191) NOT NULL,
    `update_at` DATETIME(3) NULL,
    `update_by` VARCHAR(191) NULL,
    `delete_at` DATETIME(3) NULL,
    `delete_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL,

    UNIQUE INDEX `accounts_profileId_key`(`profileId`),
    UNIQUE INDEX `accounts_login_key`(`login`),
    UNIQUE INDEX `accounts_tfa_code_key`(`tfa_code`),
    UNIQUE INDEX `accounts_email_key`(`email`),
    UNIQUE INDEX `accounts_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `profile_type` ENUM('personal', 'readers_community', 'authors_community', 'authors_union') NOT NULL DEFAULT 'readers_community',
    `profile_state` ENUM('created', 'activated', 'deleted', 'banned') NOT NULL DEFAULT 'created',
    `city_id` VARCHAR(191) NULL,
    `avatar_image_id` VARCHAR(191) NULL,
    `cover_image_id` VARCHAR(191) NULL,
    `password-length` INTEGER NOT NULL,
    `surname` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `patronymic` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `account_slug` VARCHAR(191) NULL,
    `display_name` VARCHAR(191) NULL,
    `verification_info` JSON NULL,
    `short_info` JSON NULL,
    `extra_info` JSON NULL,
    `other_links` JSON NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `create_by` VARCHAR(191) NOT NULL,
    `update_at` DATETIME(3) NULL,
    `update_by` VARCHAR(191) NULL,
    `delete_at` DATETIME(3) NULL,
    `delete_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlackList` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `vsUserId` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `create_by` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlackList` ADD CONSTRAINT `BlackList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
