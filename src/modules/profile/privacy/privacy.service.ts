import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service.js'
import * as _ from 'lodash'
import { plainToInstance } from 'class-transformer'
import { GivePrivacyDTO } from './sample/privacy.dto.js'
import { UUID } from 'crypto'
import {
    PrivacyService_INTERFACE,
    ProfileWithPrivacy,
} from './sample/privacy.interface.js'

@Injectable()
export class PrivacyService implements PrivacyService_INTERFACE {
    constructor(private readonly prisma: PrismaService) {}

    //profileId - настройки приватности какого профиля нам нужны
    //Если нету profileId, то используется accountId и персональный профиль
    async givePrivacy(
        accountId?: string,
        profileId?: string
    ): Promise<GivePrivacyDTO | string> {
        if (!profileId) {
            const profile: ProfileWithPrivacy =
                await this.prisma.profile.findFirst({
                    where: { ownerId: accountId, profileType: 'personal' },
                    include: { privacy: true },
                })
            if (!profile) {
                return 'Напишите в поддежку, похоже у вас не существует профиля'
            }
            return plainToInstance(GivePrivacyDTO, profile.privacy, {
                excludeExtraneousValues: true, // Исключить поля без @Expose
            })
        }
        const profile: ProfileWithPrivacy =
            await this.prisma.profile.findUnique({
                where: { id: profileId },
                include: { privacy: true },
            })
        if (!profile) {
            return 'Похоже, такого профиля не существует'
        }
        if (profile.ownerId !== accountId) {
            return 'Вы не владеете этим профилем'
        }
        return plainToInstance(GivePrivacyDTO, profile.privacy, {
            excludeExtraneousValues: true, // Исключить поля без @Expose
        })
    }
    //profileId - это айди изменяемого профиля, update - название поля которое надо изменить
    //value - новое значение для изменяемого поля, accountId - владелец профиля
    async updatePrivacy(
        profileId: UUID,
        update: string,
        value: string,
        accountId: UUID
    ): Promise<boolean | string> {
        const profile: ProfileWithPrivacy =
            await this.prisma.profile.findUnique({
                where: { id: profileId },
                include: { privacy: true },
            })
        if (!profile) {
            return 'Похоже, такого профиля не существует'
        }
        if (profile.ownerId !== accountId) {
            return 'Вы не имеете прав менять настройки этого профиля'
        }

        await this.prisma.privacy.update({
            where: { id: profile.privacy.id },
            data: { [update]: value },
        })

        return true
    }
}
