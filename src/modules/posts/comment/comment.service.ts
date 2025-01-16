import { Injectable } from '@nestjs/common'
import { MutexManager } from '../../../common/util/mutex.manager.js'
import { PrismaService } from '../../../core/database/prisma.service.js'

@Injectable()
export class CommentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexManager
    ) {}

    async giveComments(postId?, profileId?) {
        if (postId) {
            return this.prisma.comment.findMany({
                where: { postId: postId, deleted: false },
            })
        } else if (profileId) {
            return this.prisma.comment.findMany({
                where: { initPid: profileId, deleted: false },
            })
        } else {
            return false
        }
    }
    async writeComment(profileId, text, postId, accountId, commentId?) {
        const check = await this.prisma.post.findUnique({
            where: { id: postId },
        })
        if (!check || check.deleted === true) {
            return 'Такого поста не существует'
        }

        const check2 = await this.prisma.profile.findFirst({
            where: { ownerId: accountId, id: profileId },
        })
        if (!check2) {
            return 'Вы не имеет права писать комментарий с этого профиля'
        }

        const result = await this.prisma.comment.create({
            data: {
                initPid: profileId,
                postId: postId,
                text: text,
                createdBy: accountId,
                ...(commentId && { commentId }),
                active: false,
            },
        })
        return true
    }
    async updateComment(commentId, accountId, text) {
        const check = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: { profile: true },
        })
        if (!check || check.deleted === true) {
            return 'Такого комментария не существует'
        }
        if (check.profile.ownerId !== accountId) {
            return 'Вы не имеет право удалять этот комментарий'
        }
        await this.prisma.comment.update({
            where: { id: commentId },
            data: { text: text, updatedBy: accountId },
        })
        return true
    }
    async deleteComment(commentId, accountId) {
        const date = new Date()

        const check = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: { profile: true },
        })
        if (!check || check.deleted === true) {
            return 'Такого комментария не существует'
        }
        if (check.profile.ownerId !== accountId) {
            return 'Вы не имеете право удалять этот комментарий'
        }
        await this.prisma.comment.update({
            where: { id: commentId },
            data: { deleted: true, deletedAt: date, deletedBy: accountId },
        })
        return true
    }
}
