/*
  Warnings:

  - The values [deleted] on the enum `profiles_profile_state` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `accounts` MODIFY `account_role` ENUM('owner', 'admin', 'developer', 'moderator', 'support', 'user') NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE `profiles` MODIFY `profile_state` ENUM('created', 'activated', 'banned') NOT NULL DEFAULT 'created';
