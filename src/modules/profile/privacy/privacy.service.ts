import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import * as _ from 'lodash'

@Injectable()
export class PrivacyService {
    constructor(private readonly prisma: PrismaService) {}

    //profileId - настройки приватности какого профиля нам нужны
    //Если нету profileId, то используется accountId и персональный профиль
    async getPrivacy(accountId?: string, profileId?: string) {
        if (!profileId) {
            const profile = await this.prisma.profile.findFirst({
                where: { ownerId: accountId, profileType: 'personal' },
                include: { privacy: true },
            })
            if (!profile) {
                return 'Похоже, вашего профиля не существует'
            }
            return {
                viewProfile: profile.privacy.viewProfile,
                subscriptions: profile.privacy.subscriptions,
                posts: profile.privacy.posts,
                likes: profile.privacy.likes,
            }
        }
        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
            include: { privacy: true },
        })
        if (!profile) {
            return 'Похоже, такого профиля не существует'
        }
        return {
            viewProfile: profile.privacy.viewProfile,
            subscriptions: profile.privacy.subscriptions,
            posts: profile.privacy.posts,
            likes: profile.privacy.posts,
        }
    }
    //profileId - это айди изменяемого профиля, update - название поля которое надо изменить
    //value - новое значение для изменяемого поля, accountId - владелец профиля
    async updatePrivacy(
        profileId: string,
        update: string,
        value: string,
        accountId
    ) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
            include: { privacy: true },
        })
        if (!profile) {
            return 'Похоже, такого профиля не существует'
        }
        if (profile.ownerId !== accountId) {
            return 'Вы не имеете прав менять настройки этого профиля'
        }

        const result = await this.prisma.privacy.update({
            where: { id: profile.privacy.id },
            data: { [update]: value },
        })

        return true
    }
}
