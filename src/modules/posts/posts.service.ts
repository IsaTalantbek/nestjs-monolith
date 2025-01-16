import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service.js'

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

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
            const checkTags = tags.flat()

            where.tags = {
                some: {
                    name: { in: checkTags }, // Пытаемся найти посты с любым из переданных тегов
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
}
