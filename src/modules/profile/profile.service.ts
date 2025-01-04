import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service'
import * as _ from 'lodash'

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) {}

    async profile(userId: string) {
        return await this.prisma.account.findUnique({
            where: { id: userId },
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
        const subscribes = await this.prisma.subcribe.findMany({
            where: { subscribesAid: userProfileId, active: true },
        })
        const posts = await this.prisma.post.findMany({
            where: { userId: userProfileId, deleted: false },
        })
        let check1
        let check2

        if (userId) {
            check1 = await this.prisma.subcribe.findFirst({
                where: {
                    subscribesAid: userId,
                    authorPid: userProfileId,
                    active: true,
                },
            })
            check2 = await this.prisma.subcribe.findFirst({
                where: {
                    subscribesAid: userProfileId,
                    authorPid: userId,
                    active: true,
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
        ])

        let friend = false
        if (check1 && check2) {
            friend = true
        }
        const data: { fullData: any; subscribes: any; posts: any } = {
            fullData,
            subscribes: undefined,
            posts: undefined,
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
            data.subscribes = subscribes
        } else if (result.privacy.subscribe === 'friends' && friend) {
            data.subscribes = subscribes
        }
        if (
            result.privacy.posts !== 'nobody' &&
            result.privacy.posts !== 'friends'
        ) {
            data.posts = posts
        } else if (result.privacy.posts === 'friends' && friend) {
            data.posts = posts
        }
        return data
    }
}
