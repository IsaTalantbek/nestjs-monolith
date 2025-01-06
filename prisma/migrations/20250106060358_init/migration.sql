/*
  Warnings:

  - A unique constraint covering the columns `[user_id,vs_user_id]` on the table `friends` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `friends_user_id_vs_user_id_key` ON `friends`(`user_id`, `vs_user_id`);
