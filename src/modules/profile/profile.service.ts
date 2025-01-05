import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service'
import * as _ from 'lodash'

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) {}

    async profile(userId: string) {
        return await this.prisma.account.findUnique({
            where: { id: userId },
            include: { profile: true },
        })
    }
    async userProfile(userProfileId: string, userId?: string) {
        const result = await this.prisma.profile.findUnique({
            where: { id: userProfileId, deleted: false },
            include: { privacy: true },
        })
        if (!result) {
            return 'Такого профиля не существует'
        }
        const minData = _.pick(result, [
            'name',
            'avatarImageId',
            'coverImageId',
        ])
        const subscription = await this.prisma.subscribe.findMany({
            where: { subscriberAid: userProfileId, active: true },
        })
        const posts = await this.prisma.post.findMany({
            where: { profileId: userProfileId, deleted: false },
        })
        let check

        if (userId) {
            check = await this.prisma.friend.findFirst({
                where: {
                    OR: [
                        {
                            userId: userId,
                            vsUserId: result.ownerId,
                            active: true,
                        },
                        {
                            userId: result.ownerId,
                            vsUserId: userId,
                            active: true,
                        },
                    ],
                },
            })
        }
        const fullData = _.pick(result, [
            'name',
            'avatarImageId',
            'coverImageId',
            'verificationInfo',
            'shortInfo',
            'extraInf',
            'otherLinks',
            'subscribers',
        ])

        let friend = false
        if (check) {
            friend = true
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
            result.privacy.subscribe !== 'nobody' &&
            result.privacy.subscribe !== 'friends'
        ) {
            data.subscription = subscription
        } else if (result.privacy.subscribe === 'friends' && friend) {
            data.subscription = subscription
        }
        if (
            result.privacy.posts !== 'nobody' &&
            result.privacy.posts !== 'friends'
        ) {
            ;(data.likes = result.likes),
                (data.dislikes = result.dislikes),
                (data.ratio = result.ratio)
            data.posts = posts
        } else if (result.privacy.posts === 'friends' && friend) {
            ;(data.likes = result.likes),
                (data.dislikes = result.dislikes),
                (data.ratio = result.ratio)
            data.posts = posts
        }
        return data
    }
}
