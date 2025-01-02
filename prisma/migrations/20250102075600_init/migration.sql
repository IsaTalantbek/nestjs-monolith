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
    UNIQUE INDEX `accounts_login_email_key`(`login`, `email`),
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
    `official` BOOLEAN NOT NULL DEFAULT false,
    `username` VARCHAR(191) NULL,
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
CREATE TABLE `post` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `profileId` VARCHAR(191) NOT NULL,
    `actual` BOOLEAN NOT NULL DEFAULT true,
    `type` ENUM('article', 'poerty') NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `links` JSON NULL,
    `image` VARCHAR(191) NULL,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `dislikes` INTEGER NOT NULL DEFAULT 0,
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
CREATE TABLE `Tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tags_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Like` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'like',
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `create_by` VARCHAR(191) NOT NULL,
    `update_at` DATETIME(3) NULL,
    `update_by` VARCHAR(191) NULL,
    `delete_at` DATETIME(3) NULL,
    `delete_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL,

    UNIQUE INDEX `Like_userId_postId_type_key`(`userId`, `postId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `black_list` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `vsUserId` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `create_by` VARCHAR(191) NOT NULL,
    `update_at` DATETIME(3) NULL,
    `update_by` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `black_list_userId_vsUserId_key`(`userId`, `vsUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_post-tags` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_post-tags_AB_unique`(`A`, `B`),
    INDEX `_post-tags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `black_list` ADD CONSTRAINT `black_list_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_post-tags` ADD CONSTRAINT `_post-tags_A_fkey` FOREIGN KEY (`A`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_post-tags` ADD CONSTRAINT `_post-tags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
