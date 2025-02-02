-- CreateEnum
CREATE TYPE "accounts_roles" AS ENUM ('owner', 'admin', 'developer', 'moderator', 'support', 'user');

-- CreateEnum
CREATE TYPE "accounts_states" AS ENUM ('created', 'activated', 'deleted', 'banned');

-- CreateEnum
CREATE TYPE "profiles_type_enum" AS ENUM ('personal', 'readers_community', 'authors_community', 'authors_union');

-- CreateEnum
CREATE TYPE "profiles_states_enum" AS ENUM ('created', 'activated', 'banned');

-- CreateEnum
CREATE TYPE "privacy_type_enum" AS ENUM ('all', 'friends', 'nobody');

-- CreateEnum
CREATE TYPE "friends_type_enum" AS ENUM ('active', 'inactive', 'waiting');

-- CreateEnum
CREATE TYPE "accounts_profiles_relations_type_enum" AS ENUM ('owner', 'administrator', 'moderator', 'subscriber');

-- CreateEnum
CREATE TYPE "posts_type_enum" AS ENUM ('article', 'poetry', 'announcement');

-- CreateEnum
CREATE TYPE "like_dislike_type_enum" AS ENUM ('like', 'dislike');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "account_role" "accounts_roles" NOT NULL DEFAULT 'user',
    "account_state" "accounts_states" NOT NULL DEFAULT 'created',
    "password" TEXT NOT NULL,
    "tfa_code" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "accountUI" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "superUser" BOOLEAN NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAdress" TEXT NOT NULL,
    "ipAdressFull" TEXT NOT NULL,
    "headers" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy" (
    "id" TEXT NOT NULL,
    "viewProfile" "privacy_type_enum" NOT NULL DEFAULT 'all',
    "subscriptions" "privacy_type_enum" NOT NULL DEFAULT 'all',
    "posts" "privacy_type_enum" NOT NULL DEFAULT 'all',
    "likes" "privacy_type_enum" NOT NULL DEFAULT 'all',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "privacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statsProfile" (
    "id" TEXT NOT NULL,
    "subscribers" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "ratio" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "statsProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "profile_type" "profiles_type_enum" NOT NULL DEFAULT 'personal',
    "profile_state" "profiles_states_enum" NOT NULL DEFAULT 'created',
    "city_id" TEXT,
    "avatar_image_id" TEXT,
    "cover_image_id" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT,
    "official" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT,
    "privacyId" TEXT,
    "statsId" TEXT NOT NULL,
    "short_info" JSONB,
    "extra_info" JSONB,
    "other_links" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribes" (
    "id" TEXT NOT NULL,
    "subscriber_aid" TEXT NOT NULL,
    "author_pid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "subscribes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friends" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vs_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "type" "friends_type_enum" NOT NULL DEFAULT 'waiting',

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "actual" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "type" "posts_type_enum" NOT NULL,
    "text" TEXT NOT NULL,
    "links" JSONB,
    "image" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL DEFAULT 'System',
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "initPid" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "commentId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL DEFAULT 'System',
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "initAid" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" "like_dislike_type_enum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL DEFAULT 'System',
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "black_lists" (
    "id" TEXT NOT NULL,
    "initAid" TEXT NOT NULL,
    "vsPid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'System',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "black_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_post-tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_post-tags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_tfa_code_key" ON "accounts"("tfa_code");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_phone_key" ON "accounts"("phone");

-- CreateIndex
CREATE INDEX "Session_accountId_idx" ON "Session"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_slug_key" ON "profiles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_privacyId_key" ON "profiles"("privacyId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_statsId_key" ON "profiles"("statsId");

-- CreateIndex
CREATE UNIQUE INDEX "subscribes_subscriber_aid_author_pid_key" ON "subscribes"("subscriber_aid", "author_pid");

-- CreateIndex
CREATE INDEX "friends_user_id_vs_user_id_idx" ON "friends"("user_id", "vs_user_id");

-- CreateIndex
CREATE INDEX "friends_type_idx" ON "friends"("type");

-- CreateIndex
CREATE UNIQUE INDEX "friends_user_id_vs_user_id_key" ON "friends"("user_id", "vs_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "likes_initAid_postId_key" ON "likes"("initAid", "postId");

-- CreateIndex
CREATE INDEX "black_lists_initAid_active_idx" ON "black_lists"("initAid", "active");

-- CreateIndex
CREATE UNIQUE INDEX "black_lists_initAid_vsPid_key" ON "black_lists"("initAid", "vsPid");

-- CreateIndex
CREATE INDEX "_post-tags_B_index" ON "_post-tags"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_privacyId_fkey" FOREIGN KEY ("privacyId") REFERENCES "privacy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "statsProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscribes" ADD CONSTRAINT "subscribes_subscriber_aid_fkey" FOREIGN KEY ("subscriber_aid") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscribes" ADD CONSTRAINT "subscribes_author_pid_fkey" FOREIGN KEY ("author_pid") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_initPid_fkey" FOREIGN KEY ("initPid") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_initAid_fkey" FOREIGN KEY ("initAid") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "black_lists" ADD CONSTRAINT "black_lists_initAid_fkey" FOREIGN KEY ("initAid") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_post-tags" ADD CONSTRAINT "_post-tags_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_post-tags" ADD CONSTRAINT "_post-tags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
