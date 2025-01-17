import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service.js'
import { MutexManager } from '../../../core/util/mutex.manager.js'
import { Like } from '@prisma/client'

@Injectable()
export class StatsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexManager
    ) {}

    async giveStats(accountId: string) {
        const result = await this.prisma.like.findMany({
            where: { initAid: accountId, deleted: false },
        })
        return result.map((postId, type) => ({ postId, type }))
    }

    async addDislikeIfDeleted(prisma, postId, dislikeId, statsId) {
        await prisma.like.update({
            where: { id: dislikeId },
            data: {
                deleted: false,
                type: 'dislike',
            },
        })

        await prisma.post.update({
            where: { id: postId },
            data: {
                dislikes: { increment: 1 },
            },
        })

        await prisma.statsProfile.update({
            where: { id: statsId },
            data: {
                dislikes: { increment: 1 },
                ratio: { decrement: 1 },
            },
        })
        return true
    }

    async addLikeIfDeleted(prisma, postId, likeId, statsId) {
        await prisma.like.update({
            where: { id: likeId },
            data: {
                deleted: false,
                type: 'like',
            },
        })

        await prisma.post.update({
            where: { id: postId },
            data: {
                likes: { increment: 1 },
            },
        })

        await prisma.statsProfile.update({
            where: { id: statsId },
            data: {
                likes: { increment: 1 },
                ratio: { increment: 1 },
            },
        })
        return true
    }

    async likePost(postId: string, accountId: string) {
        return this.mutex.lock(accountId, async () => {
            const postWithInfo = await this.prisma.post.findUnique({
                where: { id: postId, deleted: false },
                include: { profile: true },
            })

            if (!postWithInfo || !postWithInfo.profile) {
                return 'Не найден пост или ее владелец'
            }

            return this.prisma.$transaction(async (prisma) => {
                const existing: Like = await prisma.like.findUnique({
                    where: {
                        initAid_postId: {
                            initAid: accountId,
                            postId,
                        },
                    },
                })

                if (existing?.type === 'like') {
                    if (existing.deleted === false) {
                        return 'Вы уже лайкнули пост'
                    }
                    return await this.addLikeIfDeleted(
                        prisma,
                        postId,
                        existing.id,
                        postWithInfo.profile.statsId
                    )
                }

                if (
                    existing?.deleted === false &&
                    existing.type === 'dislike'
                ) {
                    await prisma.like.update({
                        where: { id: existing.id },
                        data: { type: 'like', updatedBy: accountId },
                    })

                    await prisma.post.update({
                        where: { id: postId },
                        data: {
                            likes: { increment: 1 },
                            dislikes: { decrement: 1 },
                        },
                    })

                    await prisma.statsProfile.update({
                        where: { id: postWithInfo.profile.statsId },
                        data: {
                            likes: { increment: 1 },
                            dislikes: { decrement: 1 },
                            ratio: { increment: 2 },
                        },
                    })

                    return true
                } else if (existing?.deleted === true) {
                    return await this.addLikeIfDeleted(
                        prisma,
                        postId,
                        existing.id,
                        postWithInfo.profile.statsId
                    )
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

                await prisma.post.update({
                    where: { id: postId },
                    data: {
                        likes: { increment: 1 },
                    },
                })

                await prisma.statsProfile.update({
                    where: { id: postWithInfo.profile.statsId },
                    data: {
                        likes: { increment: 1 },
                        ratio: { increment: 1 },
                    },
                })

                return true
            })
        })
    }

    async dislikePost(postId: string, accountId: string) {
        return this.mutex.lock(accountId, async () => {
            const postWithInfo = await this.prisma.post.findUnique({
                where: { id: postId },
                include: { profile: true },
            })
            if (!postWithInfo || !postWithInfo.profile) {
                return 'Не найден пост или ее владелец'
            }

            return this.prisma.$transaction(async (prisma) => {
                const existing = await prisma.like.findUnique({
                    where: {
                        initAid_postId: {
                            initAid: accountId,
                            postId,
                        },
                    },
                })
                if (existing?.type === 'dislike') {
                    if (existing.deleted === false) {
                        return 'вы уже дизлайкнули пост'
                    }
                    return await this.addDislikeIfDeleted(
                        prisma,
                        postId,
                        existing.id,
                        postWithInfo.profile.statsId
                    )
                }

                if (existing?.deleted === false) {
                    await prisma.like.update({
                        where: { id: existing.id },
                        data: {
                            type: 'dislike',
                            updatedBy: accountId,
                        },
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
                } else if (existing?.deleted === true) {
                    return await this.addDislikeIfDeleted(
                        prisma,
                        postId,
                        existing.id,
                        postWithInfo.profile.statsId
                    )
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
        })
    }

    async deleteStats(postId: string, accountId: string) {
        const date = new Date()

        return this.mutex.lock(accountId, async () => {
            const postWithInfo = await this.prisma.post.findUnique({
                where: { id: postId },
                include: { profile: true },
            })
            if (!postWithInfo || !postWithInfo.profile) {
                return 'Не найден пост или ее владелец'
            }

            return this.prisma.$transaction(async (prisma) => {
                const exist = await prisma.like.findFirst({
                    where: {
                        initAid: accountId,
                        postId: postId,
                    },
                })
                if (!exist || exist.deleted === true) {
                    return 'Похоже, вы не ставили реакцию на этот пост'
                }
                if (exist.type === 'like') {
                    await prisma.like.update({
                        where: { id: exist.id },
                        data: {
                            deleted: true,
                            deletedAt: date,
                            deletedBy: accountId,
                        },
                    })
                    await prisma.post.update({
                        where: { id: postId },
                        data: { likes: { decrement: 1 } },
                    })
                    await prisma.statsProfile.update({
                        where: { id: postWithInfo.profile.statsId },
                        data: {
                            likes: { decrement: 1 },
                            ratio: { decrement: 1 },
                        },
                    })
                    return true
                }
                await prisma.like.update({
                    where: { id: exist.id },
                    data: {
                        deleted: true,
                        deletedAt: date,
                        deletedBy: accountId,
                    },
                })
                await prisma.post.update({
                    where: { id: postId },
                    data: { dislikes: { decrement: 1 } },
                })
                await prisma.statsProfile.update({
                    where: { id: postWithInfo.profile.statsId },
                    data: {
                        dislikes: { decrement: 1 },
                        ratio: { increment: 1 },
                    },
                })
                return true
            })
        })
    }
}
