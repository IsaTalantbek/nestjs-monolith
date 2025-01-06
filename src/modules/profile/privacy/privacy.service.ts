import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import * as _ from 'lodash'

@Injectable()
export class PrivacyService {
    constructor(private readonly prisma: PrismaService) {}

    //profileId - настройки приватности какого профиля нам нужны
    //Если нету profileId, то используется userId и персональный профиль
    async getPrivacy(userId?: string, profileId?: string) {
        if (!profileId) {
            const profile = await this.prisma.profile.findFirst({
                where: { ownerId: userId, profileType: 'personal' },
                include: { privacy: true },
            })
            if (!profile) {
                return 'Похоже, вашего профиля не существует'
            }
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
    //profileId - это айди изменяемого профиля, update - название поля которое надо изменить
    //value - новое значение для изменяемого поля, userId - владелец профиля
    async updatePrivacy(
        profileId: string,
        update: string,
        value: string,
        userId
    ) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
            include: { privacy: true },
        })
        if (!profile) {
            return 'Похоже, такого профиля не существует'
        }
        if (profile.ownerId !== userId) {
            return 'Вы не имеете прав менять настройки этого профиля'
        }
        await this.prisma.privacy.update({
            where: { id: profile.privacy.id },
            data: { [update]: value },
        })
        return true
    }
}
