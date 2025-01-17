-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `account_role` ENUM('owner', 'user', 'developer', 'moderator', 'support') NOT NULL DEFAULT 'user',
    `account_state` ENUM('created', 'activated', 'deleted', 'banned') NOT NULL DEFAULT 'created',
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `tfa_code` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `accountUI` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `accounts_login_key`(`login`),
    UNIQUE INDEX `accounts_tfa_code_key`(`tfa_code`),
    UNIQUE INDEX `accounts_email_key`(`email`),
    UNIQUE INDEX `accounts_phone_key`(`phone`),
    UNIQUE INDEX `accounts_login_email_key`(`login`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `superUser` BOOLEAN NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `ipAdress` VARCHAR(191) NOT NULL,
    `ipAdressFull` VARCHAR(191) NOT NULL,
    `headers` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL DEFAULT false,

    INDEX `Session_accountId_idx`(`accountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `privacy` (
    `id` VARCHAR(191) NOT NULL,
    `viewProfile` ENUM('all', 'friends', 'nobody') NOT NULL DEFAULT 'all',
    `subscriptions` ENUM('all', 'friends', 'nobody') NOT NULL DEFAULT 'all',
    `posts` ENUM('all', 'friends', 'nobody') NOT NULL DEFAULT 'all',
    `likes` ENUM('all', 'friends', 'nobody') NOT NULL DEFAULT 'all',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statsProfile` (
    `id` VARCHAR(191) NOT NULL,
    `subscribers` INTEGER NOT NULL DEFAULT 0,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `dislikes` INTEGER NOT NULL DEFAULT 0,
    `ratio` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `profile_type` ENUM('personal', 'readers_community', 'authors_community', 'authors_union') NOT NULL DEFAULT 'personal',
    `profile_state` ENUM('created', 'activated', 'deleted', 'banned') NOT NULL DEFAULT 'created',
    `city_id` VARCHAR(191) NULL,
    `avatar_image_id` VARCHAR(191) NULL,
    `cover_image_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `official` BOOLEAN NOT NULL DEFAULT false,
    `ownerId` VARCHAR(191) NULL,
    `privacyId` VARCHAR(191) NULL,
    `statsId` VARCHAR(191) NOT NULL,
    `short_info` JSON NULL,
    `extra_info` JSON NULL,
    `other_links` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `profiles_privacyId_key`(`privacyId`),
    UNIQUE INDEX `profiles_statsId_key`(`statsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscribes` (
    `id` VARCHAR(191) NOT NULL,
    `subscriber_aid` VARCHAR(191) NOT NULL,
    `author_pid` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `subscribes_subscriber_aid_author_pid_key`(`subscriber_aid`, `author_pid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friends` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `vs_user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NULL,
    `type` ENUM('active', 'inactive', 'waiting') NOT NULL DEFAULT 'waiting',

    INDEX `friends_user_id_vs_user_id_idx`(`user_id`, `vs_user_id`),
    INDEX `friends_type_idx`(`type`),
    UNIQUE INDEX `friends_user_id_vs_user_id_key`(`user_id`, `vs_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `profile_id` VARCHAR(191) NOT NULL,
    `actual` BOOLEAN NOT NULL DEFAULT true,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('article', 'poetry', 'announcement') NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `links` JSON NULL,
    `image` VARCHAR(191) NULL,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `dislikes` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `initPid` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `commentId` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',

    UNIQUE INDEX `tags_name_key`(`name`),
    INDEX `tags_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `id` VARCHAR(191) NOT NULL,
    `initAid` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'like',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `deleted` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `likes_initAid_postId_key`(`initAid`, `postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `black_lists` (
    `id` VARCHAR(191) NOT NULL,
    `initAid` VARCHAR(191) NOT NULL,
    `vsPid` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL DEFAULT 'System',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,

    INDEX `black_lists_initAid_active_idx`(`initAid`, `active`),
    UNIQUE INDEX `black_lists_initAid_vsPid_key`(`initAid`, `vsPid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_post-tags` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_post-tags_AB_unique`(`A`, `B`),
    INDEX `_post-tags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_privacyId_fkey` FOREIGN KEY (`privacyId`) REFERENCES `privacy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_statsId_fkey` FOREIGN KEY (`statsId`) REFERENCES `statsProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscribes` ADD CONSTRAINT `subscribes_subscriber_aid_fkey` FOREIGN KEY (`subscriber_aid`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscribes` ADD CONSTRAINT `subscribes_author_pid_fkey` FOREIGN KEY (`author_pid`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friends` ADD CONSTRAINT `friends_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_initPid_fkey` FOREIGN KEY (`initPid`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_initAid_fkey` FOREIGN KEY (`initAid`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `black_lists` ADD CONSTRAINT `black_lists_initAid_fkey` FOREIGN KEY (`initAid`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_post-tags` ADD CONSTRAINT `_post-tags_A_fkey` FOREIGN KEY (`A`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_post-tags` ADD CONSTRAINT `_post-tags_B_fkey` FOREIGN KEY (`B`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
