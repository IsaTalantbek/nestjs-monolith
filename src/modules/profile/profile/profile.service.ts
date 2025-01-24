import { Injectable } from '@nestjs/common'
import { Account, Post, Subscription } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../../../core/database/prisma.service.js'
import { MyAccountDTO, MyProfileDTO } from './sample/profile.dto.js'
import {
    FullData,
    MinData,
    ProfilePrivacyStats,
    ProfileService_INTERFACE,
    UserProfileData,
} from './sample/profile.interface.js'

@Injectable()
export class ProfileService implements ProfileService_INTERFACE {
    constructor(private readonly prisma: PrismaService) {}

    async myProfile(
        accountId: string,
        slug?: string
    ): Promise<MyProfileDTO | string> {
        let result
        if (slug) {
            result = await this.prisma.profile.findUnique({
                where: { slug: slug, ownerId: accountId },
            })
        } else {
            result = await this.prisma.profile.findFirst({
                where: { ownerId: accountId, profileType: 'personal' },
            })
            if (!result) {
                throw new Error(`У пользователя нет профиля ${accountId}`)
            }
        }
        if (!result) {
            return 'Похоже такого профиля не существует, либо вы им не владеете'
        }
        return plainToInstance(MyProfileDTO, result, {
            excludeExtraneousValues: true, // Исключить поля без @Expose
        })
    }

    async myAccount(accountId: string): Promise<MyAccountDTO> {
        const result: Account | null = await this.prisma.account.findUnique({
            where: { id: accountId },
        })
        if (!result) {
            throw new Error(`У пользователя нет аккаунта ${accountId}`)
        }
        return plainToInstance(MyAccountDTO, result, {
            excludeExtraneousValues: true, // Исключить поля без @Expose
        })
    }
    //Тут можно получить информацию о профиле. Айди пользователя
    //по желанию. Но если у профиля включены настройки 'friends'
    //то только друзья могут получить дополнительную информацию
    async userProfile(
        slug: string,
        accountId?: string
    ): Promise<MinData | UserProfileData | string> {
        const result: ProfilePrivacyStats | null =
            await this.prisma.profile.findUnique({
                where: { slug: slug, deleted: false },
                include: { privacy: true, stats: true },
            })
        if (!result) {
            return 'Такого профиля не существует'
        }
        const minData = {
            name: result.name,
            avatarImage: result.avatarImageId,
            coverImage: result.coverImageId,
        } as MinData

        if (!result.ownerId) {
            throw new Error(`У профиля нет владелельца: ${result}`)
        }

        const subscription: Subscription[] | null =
            await this.prisma.subscription.findMany({
                where: { subscriberAid: result.ownerId, active: true },
            })
        const posts: Post[] = await this.prisma.post.findMany({
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
        } as FullData

        const data: {
            fullData?: any
            subscription?: any
            posts?: any
            likes?: any
            dislikes?: any
            ratio?: any
        } = {
            fullData,
            subscription: undefined,
            posts: undefined,
            likes: undefined,
            dislikes: undefined,
            ratio: undefined,
        } as UserProfileData
        if (!result.privacy) {
            throw new Error(
                `У профиля не существует настроек приватности: ${result}`
            )
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
            data.likes = result.stats.likes
            data.dislikes = result.stats.dislikes
            data.ratio = result.stats.ratio
            data.posts = posts
        } else if (result.privacy.posts === 'friends' && friend) {
            data.likes = result.stats.likes
            data.dislikes = result.stats.dislikes
            data.ratio = result.stats.ratio
            data.posts = posts
        }
        return data
    }
}
