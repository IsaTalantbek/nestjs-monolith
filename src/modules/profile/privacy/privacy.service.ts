import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import * as _ from 'lodash'

@Injectable()
export class PrivacyService {
    constructor(private readonly prisma: PrismaService) {}

    async getPrivacy(userId?: string, profileId?: string) {
        if (!profileId) {
            const profile = await this.prisma.profile.findFirst({
                where: { ownerId: userId, profileType: 'personal' },
                include: { privacy: true },
            })
            return _.pick(
                profile.privacy,
                'viewProfile',
                'subscribe',
                'like',
                'posts'
            )
        }
        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
            include: { privacy: true },
        })
        if (!profile) {
            return 'Похоже, такого профиля не существует'
        }
        return _.pick(
            profile.privacy,
            'viewProfile',
            'subscribe',
            'like',
            'posts'
        )
    }
    async updatePrivacy(profileId: string, update: string, value: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
            include: { privacy: true },
        })
        if (!profile) {
            return 'Похоже, такого профиля не существует'
        }
        await this.prisma.privacy.update({
            where: { id: profile.privacy.id },
            data: { [update]: value },
        })
        return true
    }
}
