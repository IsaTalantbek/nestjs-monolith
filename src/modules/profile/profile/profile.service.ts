import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service.js'
import {
    ProfilePrivacyStatsInterface,
    ProfileServiceInterface,
    UserProfileResult,
} from './profile.interface.js'
import { Post, Subscription } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { MyAccountDTO, MyProfileDTO } from './profile.dto.js'

@Injectable()
export class ProfileService implements ProfileServiceInterface {
    constructor(private readonly prisma: PrismaService) {}

    async myProfile(
        accountId: string,
        profileId?: string
    ): Promise<MyProfileDTO | string> {
        let result
        if (!profileId) {
            result = await this.prisma.profile.findFirst({
                where: { ownerId: accountId, profileType: 'personal' },
            })
        } else {
            result = await this.prisma.profile.findUnique({
                where: { id: profileId, ownerId: accountId },
            })
        }
        if (!result) {
            return 'Похоже такого профиля не существует, либо вы им не владеете'
        }
        return plainToInstance(MyProfileDTO, result, {
            excludeExtraneousValues: true, // Исключить поля без @Expose
        })
    }

    async myAccount(accountId: string): Promise<MyAccountDTO> {
        const result = await this.prisma.account.findUnique({
            where: { id: accountId },
        })
        return plainToInstance(MyAccountDTO, result, {
            excludeExtraneousValues: true, // Исключить поля без @Expose
        })
    }
    //Тут можно получить информацию о профиле. Айди пользователя
    //по желанию. Но если у профиля включены настройки 'friends'
    //то только друзья могут получить дополнительную информацию
    async userProfile(
        userPid: string,
        accountId?: string
    ): Promise<UserProfileResult | string> {
        const result: ProfilePrivacyStatsInterface =
            await this.prisma.profile.findUnique({
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
        const subscription: Subscription[] =
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
