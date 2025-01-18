import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service.js'

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) {}

    //Возвращает всю информацию о своем аккаунте. Изменить потом,
    //Сделать меньше информации
    async myProfile(accountId: string) {
        return await this.prisma.account.findUnique({
            where: { id: accountId },
            include: { profiles: true },
        })
    }
    //Тут можно получить информацию о профиле. Айди пользователя
    //по желанию. Но если у профиля включены настройки 'friends'
    //то только друзья могут получить дополнительную информацию
    async userProfile(userPid: string, accountId?: string) {
        const result = await this.prisma.profile.findUnique({
            where: { id: userPid, deleted: false },
            include: { privacy: true, stats: true },
        })
        if (!result) {
            return 'Такого профиля не существует'
        }
        const minData = {
            name: result.name,
            avatarImage: result.avatarImageId,
            coverImage: result.coverImageId,
        }
        const subscription = await this.prisma.subscribtion.findMany({
            where: { subscriberAid: result.ownerId, active: true },
        })
        const posts = await this.prisma.post.findMany({
            where: { initPid: result.id, deleted: false },
        })

        let friend

        if (accountId) {
            friend = await this.prisma.friend.findFirst({
                where: {
                    OR: [
                        {
                            initAid: accountId,
                            vsAid: result.ownerId,
                            type: 'active',
                        },
                        {
                            initAid: result.ownerId,
                            vsAid: accountId,
                            type: 'active',
                        },
                    ],
                },
            })
        }
        const fullData = {
            name: result.name,
            avatarImage: result.avatarImageId,
            coverImage: result.coverImageId,
            offcial: result.official,
            shortInfo: result.shortInfo,
            extraInfo: result.extraInfo,
            otherLinks: result.otherLinks,
            subscribers: result.stats.subscribers,
        }

        const data: {
            fullData: any
            subscription: any
            posts: any
            likes: any
            dislikes: any
            ratio: any
        } = {
            fullData,
            subscription: undefined,
            posts: undefined,
            likes: undefined,
            dislikes: undefined,
            ratio: undefined,
        }
        if (result.privacy.viewProfile === 'nobody') {
            return minData
        } else if (result.privacy.viewProfile === 'friends' && !friend) {
            return minData
        }
        if (
            result.privacy.subscriptions !== 'nobody' &&
            result.privacy.subscriptions !== 'friends'
        ) {
            data.subscription = subscription
        } else if (result.privacy.subscriptions === 'friends' && friend) {
            data.subscription = subscription
        }
        if (
            result.privacy.posts !== 'nobody' &&
            result.privacy.posts !== 'friends'
        ) {
            ;(data.likes = result.stats.likes),
                (data.dislikes = result.stats.dislikes),
                (data.ratio = result.stats.ratio)
            data.posts = posts
        } else if (result.privacy.posts === 'friends' && friend) {
            ;(data.likes = result.stats.likes),
                (data.dislikes = result.stats.dislikes),
                (data.ratio = result.stats.ratio)
            data.posts = posts
        }
        return data
    }
}
