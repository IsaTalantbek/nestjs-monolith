import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/database/prisma.service'
import { Mutex } from 'async-mutex'

@Injectable()
export class PostsService {
    private readonly userLocks = new Map<string, Mutex>()

    constructor(private readonly prisma: PrismaService) {}
    private getMutex(userId: string): Mutex {
        if (!this.userLocks.has(userId)) {
            this.userLocks.set(userId, new Mutex())
        }
        return this.userLocks.get(userId)!
    }

    async givePosts(type: string, userId?: string, tags?: Array<string>) {
        const where: {
            type: any
            tags?: any
            NOT?: {
                like?: {
                    some: {
                        userId: any
                    }
                }
            }
        } = {
            type,
        }
        // Если теги переданы, добавляем условие для поиска по тегам
        if (tags && tags.length > 0) {
            where.tags = {
                some: {
                    name: { in: tags }, // Пытаемся найти посты с любым из переданных тегов
                },
            }
        }

        // Если передан userId, исключаем посты, которые уже были лайкнуты этим пользователем
        if (userId) {
            where.NOT = {
                like: {
                    some: {
                        userId: userId,
                    },
                },
            }
        }

        // Выполняем запрос с фильтрацией по type, тегам и исключению лайков пользователя
        const posts = await this.prisma.post.findMany({
            where: where,
            take: 3,
            orderBy: {
                createAt: 'desc', // Сортировка по дате создания
            },
        })

        const officialPosts = await this.prisma.post.findMany({
            where: where,
            take: 2,
        })

        const mostLikedPosts = await this.prisma.post.findMany({
            where: where,
            take: 2,
            orderBy: {
                likes: 'desc', // Сортировка по количеству лайков
            },
        })

        // Объединяем все результаты и убираем дубли
        const result = [...posts, ...officialPosts, ...mostLikedPosts]

        return Array.from(new Set(result.map((a) => a.id))).map((id) =>
            result.find((a) => a.id === id)
        )
    }
    async likePost(postId: string, userId: string) {
        const userMutex = this.getMutex(userId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const postWithInfo = await prisma.post.findFirst({
                    where: { id: postId },
                    include: { profile: true },
                })

                if (!postWithInfo || !postWithInfo.profile) {
                    console.error(
                        `maybe bug in likeService: ${postWithInfo.id}`
                    )
                    return { message: 'Не найден пост или ее владелец' }
                }

                const existingLike = await prisma.like.findUnique({
                    where: {
                        userId_postId_type: { userId, postId, type: 'like' },
                    },
                })

                if (existingLike) {
                    return { message: 'Человек уже лайкнул пост' }
                }

                const existingDislike = await prisma.like.findUnique({
                    where: {
                        userId_postId_type: { userId, postId, type: 'dislike' },
                    },
                })

                let updatedPost
                let updatedProfile

                if (existingDislike) {
                    await prisma.like.update({
                        where: { id: existingDislike.id },
                        data: { type: 'like', updateBy: 'PostsService' },
                    })

                    updatedPost = await prisma.post.update({
                        where: { id: postId },
                        data: {
                            likes: { increment: 1 },
                            dislikes: { decrement: 1 },
                        },
                    })

                    updatedProfile = await prisma.profile.update({
                        where: { id: postWithInfo.profile.id },
                        data: {
                            likes: { increment: 1 },
                            dislikes: { decrement: 1 },
                            ratio: { increment: 2 },
                        },
                    })

                    return true
                }

                await prisma.like.create({
                    data: {
                        userId,
                        postId,
                        type: 'like',
                        createBy: 'PostsService',
                        updateBy: 'PostsService',
                    },
                })

                updatedPost = await prisma.post.update({
                    where: { id: postId },
                    data: {
                        likes: { increment: 1 },
                    },
                })

                updatedProfile = await prisma.profile.update({
                    where: { id: postWithInfo.profile.id },
                    data: {
                        likes: { increment: 1 },
                        ratio: { increment: 1 },
                    },
                })

                return true
            })

            return result
        } finally {
            release()
        }
    }
    async dislikePost(postId: string, userId: string) {
        const userMutex = this.getMutex(userId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const postWithInfo = await prisma.post.findFirst({
                    where: { id: postId },
                    include: { profile: true },
                })

                if (!postWithInfo || !postWithInfo.profile) {
                    console.error(
                        `maybe bug in dislikeService: ${postWithInfo.id}`
                    )
                    return { message: 'Не найден пост или ее владелец' }
                }

                const existingDislike = await prisma.like.findUnique({
                    where: {
                        userId_postId_type: { userId, postId, type: 'dislike' },
                    },
                })

                if (existingDislike) {
                    return { message: 'Человек уже дизлайкнул пост' }
                }

                const existingLike = await prisma.like.findUnique({
                    where: {
                        userId_postId_type: { userId, postId, type: 'like' },
                    },
                })

                if (existingLike) {
                    await prisma.like.update({
                        where: { id: existingDislike.id },
                        data: { type: 'dislike', updateBy: 'PostsService' },
                    })

                    await prisma.post.update({
                        where: { id: postId },
                        data: {
                            likes: { decrement: 1 },
                            dislikes: { increment: 1 },
                        },
                    })

                    await prisma.profile.update({
                        where: { id: postWithInfo.profile.id },
                        data: {
                            likes: { decrement: 1 },
                            dislikes: { increment: 1 },
                            ratio: { decrement: 2 },
                        },
                    })

                    return true
                }

                await prisma.like.create({
                    data: {
                        userId,
                        postId,
                        type: 'dislike',
                        createBy: 'PostsService',
                        updateBy: 'PostsService',
                    },
                })

                await prisma.post.update({
                    where: { id: postId },
                    data: {
                        dislikes: { increment: 1 },
                    },
                })

                await prisma.profile.update({
                    where: { id: postWithInfo.profile.id },
                    data: {
                        dislikes: { increment: 1 },
                        ratio: { decrement: 1 },
                    },
                })

                return true
            })

            return result
        } finally {
            release()
        }
    }
}
