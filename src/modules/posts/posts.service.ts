import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/database/prisma.service'

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

    async givePosts(type, tags?, userId?) {
        console.log(tags)
        if (type !== 'article' && type !== 'poetry') {
            return false
        }
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
}
