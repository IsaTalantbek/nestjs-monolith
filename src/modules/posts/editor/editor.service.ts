import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/database/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class EditorService {
    constructor(private readonly prisma: PrismaService) {}

    async createPost(type, tags, userId, profileId, text) {
        const data: Prisma.PostCreateInput = {
            type,
            text,
            createBy: 'editorService',
            user: { connect: { id: userId } }, // Связь с пользователем
            profile: { connect: { id: profileId } }, // Связь с профилем
        }

        if (tags && tags.length > 0) {
            const tagObjects = await Promise.all(
                tags.map(async (tag) => {
                    const existingTag = await this.prisma.tags.findUnique({
                        where: { name: tag },
                    })
                    if (existingTag) {
                        return existingTag
                    } else {
                        return await this.prisma.tags.create({
                            data: { name: tag },
                        })
                    }
                })
            )

            // Добавление связи с тегами
            data.tags = {
                connect: tagObjects.map((tag) => ({ id: tag.id })),
            }
        }

        const post = await this.prisma.post.create({ data })
        return post
    }
}
