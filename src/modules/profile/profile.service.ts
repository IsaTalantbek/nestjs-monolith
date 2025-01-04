import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service'
import _ from 'lodash'

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) {}

    async profile(userId: string) {
        return await this.prisma.account.findUnique({
            where: { id: userId },
        })
    }
    async userProfile(userId: string, userProfileId: string) {
        console.log(userProfileId)
        const result = await this.prisma.profile.findUnique({
            where: { id: userProfileId, deleted: false },
            include: { owner: true, privacy: true },
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
            where: { userId: userProfileId, active: true },
        })
        const posts = await this.prisma.post.findMany({
            where: { userId: userProfileId, deleted: false },
        })
        const fullData = _.pick(result, [
            'name',
            'avatarImageId',
            'coverImageId',
            'verificationInfo',
            'shortInfo',
            'extraInf',
            'otherLinks',
        ])
        const check1 = await this.prisma.subcribe.findFirst({
            where: { userId: userId, profileId: userProfileId },
        })
        const check2 = await this.prisma.subcribe.findFirst({
            where: { userId: userProfileId, profileId: userId },
        })
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
