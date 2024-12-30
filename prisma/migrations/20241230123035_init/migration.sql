-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_role` ENUM('owner', 'user', 'developer', 'moderator', 'support') NOT NULL DEFAULT 'user',
    `account_state` ENUM('created', 'activated', 'deleted', 'banned') NOT NULL DEFAULT 'created',
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `tfa_code` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `surname` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `patronymic` VARCHAR(191) NULL,
    `create_at` DATETIME(3) NULL,
    `update_at` DATETIME(3) NULL,
    `delete_at` DATETIME(3) NULL,
    `deleted` BOOLEAN NULL,

    UNIQUE INDEX `accounts_login_key`(`login`),
    UNIQUE INDEX `accounts_tfa_code_key`(`tfa_code`),
    UNIQUE INDEX `accounts_email_key`(`email`),
    UNIQUE INDEX `accounts_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
