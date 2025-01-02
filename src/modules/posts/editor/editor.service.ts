import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/database/prisma.service'

@Injectable()
export class EditorService {
    constructor(private readonly prisma: PrismaService) {}

    async createPost(type, tags, userId, profileId, text) {
        // Создание тега: сначала проверяем, существуют ли уже теги
        const tagObjects = await Promise.all(
            tags.map(async (tag) => {
                const existingTag = await this.prisma.tags.findUnique({
                    where: { name: tag },
                })
                if (existingTag) {
                    return existingTag // Возвращаем уже существующий тег
                } else {
                    // Создаем новый тег
                    return await this.prisma.tags.create({
                        data: { name: tag },
                    })
                }
            })
        )

        // Создание поста и связывание его с тегами
        const post = await this.prisma.post.create({
            data: {
                type: type,
                text: text,
                userId: userId,
                profileId: profileId,
                tags: {
                    connect: tagObjects.map((tag) => ({ id: tag.id })), // Устанавливаем связь с тегами
                },
                createBy: 'editorService',
            },
        })

        return post
    }
}
