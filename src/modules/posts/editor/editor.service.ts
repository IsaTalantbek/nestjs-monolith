import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as _ from 'lodash'
import { CreatePostForm } from './editor.dto.js'
import { PrismaService } from '../../../core/database/prisma.service.js'
import { MutexManager } from '../../../core/util/mutex.manager.js'

@Injectable()
export class EditorService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexManager
    ) {}

    async createPost({
        type,
        tags,
        accountId,
        profileId,
        text,
        title,
    }: CreatePostForm) {
        return this.mutex.lock(accountId, async () => {
            const data: Prisma.PostCreateInput = {
                title,
                type,
                text,
                createdBy: accountId,
                user: { connect: { id: accountId } }, // Связь с пользователем
                profile: { connect: { id: profileId } }, // Связь с профилем
            }

            const check = await this.prisma.profile.findFirst({
                where: { id: profileId },
            })
            if (!check) {
                return false
            }
            if (tags && tags.length > 0) {
                await this.prisma.$transaction(async (prisma) => {
                    const existingTags = await prisma.tags.findMany({
                        where: { name: { in: tags } },
                    })

                    const existingTagNames = existingTags.map((tag) => tag.name)
                    const newTags = tags.filter(
                        (tag) => !existingTagNames.includes(tag)
                    )

                    await prisma.tags.createMany({
                        data: newTags.map((tag) => ({
                            name: tag,
                            createdBy: accountId,
                        })),
                    })

                    const tagObjects = [
                        ...existingTags,
                        ...(await prisma.tags.findMany({
                            where: { name: { in: newTags } },
                        })),
                    ]

                    data.tags = {
                        connect: tagObjects.map((tag) => ({ id: tag.id })),
                    }
                })
            }

            const post = await this.prisma.post.create({ data })
            const postData = {
                id: post.id,
            }
            return postData
        })
    }
}
