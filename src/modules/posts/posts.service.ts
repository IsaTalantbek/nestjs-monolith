import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/database/prisma.service'
import { MutexManager } from 'src/common/util/mutex.manager'

@Injectable()
export class PostsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexManager
    ) {}

    async givePosts(type: string, accountId?: string, tags?: Array<string>) {
        const deleted = false
        const where: {
            deleted: any
            type: any
            tags?: any
            NOT?: {
                like?: {
                    some: {
                        initAid: string
                    }
                }
            }
        } = {
            type,
            deleted,
        }
        // Если теги переданы, добавляем условие для поиска по тегам
        if (tags && tags.length > 0) {
            where.tags = {
                some: {
                    name: { in: tags }, // Пытаемся найти посты с любым из переданных тегов
                },
            }
        }

        // Если передан accountId, исключаем посты, которые уже были лайкнуты этим пользователем
        if (accountId) {
            where.NOT = {
                like: {
                    some: {
                        initAid: accountId,
                    },
                },
            }
        }

        // Выполняем запрос с фильтрацией по type, тегам и исключению лайков пользователя
        const posts = await this.prisma.post.findMany({
            where: where,
            take: 3,
            orderBy: {
                createdAt: 'desc', // Сортировка по дате создания
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
    async likePost(postId: string, accountId: string) {
        return this.mutex.blockWithMutex(accountId, async () => {
            const result = await this.prisma.$transaction(async (prisma) => {
                const postWithInfo = await prisma.post.findFirst({
                    where: { id: postId, deleted: false },
                    include: { profile: true },
                })

                if (!postWithInfo || !postWithInfo.profile) {
                    return 'Не найден пост или ее владелец'
                }

                const existingLike = await prisma.like.findUnique({
                    where: {
                        initAid_postId_type: {
                            initAid: accountId,
                            postId,
                            type: 'like',
                        },
                    },
                })

                if (existingLike) {
                    return 'Человек уже лайкнул пост'
                }

                const existingDislike = await prisma.like.findUnique({
                    where: {
                        initAid_postId_type: {
                            initAid: accountId,
                            postId,
                            type: 'dislike',
                        },
                    },
                })

                let updatedPost
                let updatedProfile

                if (existingDislike) {
                    await prisma.like.update({
                        where: { id: existingDislike.id },
                        data: { type: 'like', updatedBy: accountId },
                    })

                    updatedPost = await prisma.post.update({
                        where: { id: postId },
                        data: {
                            likes: { increment: 1 },
                            dislikes: { decrement: 1 },
                        },
                    })

                    updatedProfile = await prisma.statsProfile.update({
                        where: { id: postWithInfo.profile.statsId },
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
                        initAid: accountId,
                        postId,
                        type: 'like',
                        createdBy: accountId,
                        updatedBy: accountId,
                    },
                })

                updatedPost = await prisma.post.update({
                    where: { id: postId },
                    data: {
                        likes: { increment: 1 },
                    },
                })

                updatedProfile = await prisma.statsProfile.update({
                    where: { id: postWithInfo.profile.statsId },
                    data: {
                        likes: { increment: 1 },
                        ratio: { increment: 1 },
                    },
                })

                return true
            })

            return result
        })
    }
    async dislikePost(postId: string, accountId: string) {
        return this.mutex.blockWithMutex(accountId, async () => {
            const result = await this.prisma.$transaction(async (prisma) => {
                const postWithInfo = await prisma.post.findUnique({
                    where: { id: postId },
                    include: { profile: true },
                })
                if (!postWithInfo || !postWithInfo.profile) {
                    return 'Не найден пост или ее владелец'
                }
                const existingDislike = await prisma.like.findUnique({
                    where: {
                        initAid_postId_type: {
                            initAid: accountId,
                            postId,
                            type: 'dislike',
                        },
                    },
                })
                if (existingDislike) {
                    return 'Человек уже дизлайкнул пост'
                }

                const existingLike = await prisma.like.findUnique({
                    where: {
                        initAid_postId_type: {
                            initAid: accountId,
                            postId,
                            type: 'like',
                        },
                    },
                })
                if (existingLike) {
                    await prisma.like.update({
                        where: { id: existingLike.id },
                        data: { type: 'dislike', updatedBy: accountId },
                    })
                    await prisma.post.update({
                        where: { id: postId },
                        data: {
                            likes: { decrement: 1 },
                            dislikes: { increment: 1 },
                        },
                    })
                    await prisma.statsProfile.update({
                        where: { id: postWithInfo.profile.statsId },
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
                        initAid: accountId,
                        postId,
                        type: 'dislike',
                        createdBy: accountId,
                        updatedBy: accountId,
                    },
                })

                await prisma.post.update({
                    where: { id: postId },
                    data: {
                        dislikes: { increment: 1 },
                    },
                })

                await prisma.statsProfile.update({
                    where: { id: postWithInfo.profile.statsId },
                    data: {
                        dislikes: { increment: 1 },
                        ratio: { decrement: 1 },
                    },
                })

                return true
            })

            return result
        })
    }
}
