/*
  Warnings:

  - A unique constraint covering the columns `[login,email]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,vsUserId]` on the table `BlackList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `accounts_login_email_key` ON `accounts`(`login`, `email`);

-- CreateIndex
CREATE UNIQUE INDEX `BlackList_userId_vsUserId_key` ON `BlackList`(`userId`, `vsUserId`);
