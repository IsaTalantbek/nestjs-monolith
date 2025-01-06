import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/database/prisma.service'
import { Prisma } from '@prisma/client'
import * as _ from 'lodash'
import { Mutex } from 'async-mutex'

@Injectable()
export class EditorService {
    constructor(private readonly prisma: PrismaService) {}

    async createPost(type, tags, userId, profileId, text, title) {
        const data: Prisma.PostCreateInput = {
            title,
            type,
            text,
            createdBy: userId,
            user: { connect: { id: userId } }, // Связь с пользователем
            profile: { connect: { id: profileId } }, // Связь с профилем
        }

        const check = this.prisma.profile.findFirst({
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
                        createdBy: userId,
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
        const postData = _.pick(
            post,
            'tags',
            'title',
            'text',
            'links',
            'image',
            'profileId'
        )
        return postData
    }
}
