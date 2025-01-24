import { Injectable } from '@nestjs/common'
import { UUID } from 'crypto'
import { Profile, Subscription } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../../../core/database/prisma.service.js'
import { MutexService } from '../../../core/util/mutex/mutex.service.js'
import { SubscriptionsDTO } from './sample/subscribe.dto.js'
import { subscribeService_INTERFACE } from './sample/subscribe.interface.js'

@Injectable()
export class SubscribeService implements subscribeService_INTERFACE {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexService
    ) {}

    //Если передан userPid, возвращает все подписки которые оформлены на этот профиль
    //Если передан accountId, возвращает все подписки этого аккаунта
    async giveSubscriptions(
        accountId?: UUID,
        profileId?: UUID
    ): Promise<string | SubscriptionsDTO[]> {
        if (profileId) {
            const check = await this.prisma.profile.findUnique({
                where: { id: profileId },
            })
            if (!check) {
                return 'Такого профиля не существует'
            } else if (check.ownerId !== accountId) {
                return 'Вы не владеете этим профилем'
            }
            const result = await this.prisma.subscription.findMany({
                where: { authorPid: profileId, active: true },
            })
            return plainToInstance(SubscriptionsDTO, result, {
                excludeExtraneousValues: true, // Исключить поля без @Expose
                enableImplicitConversion: true, // Для поддержки конверсии типов, если требуется
            })
        } else if (accountId) {
            const result = await this.prisma.subscription.findMany({
                where: { subscriberAid: accountId, active: true },
            })
            return plainToInstance(SubscriptionsDTO, result, {
                excludeExtraneousValues: true, // Исключить поля без @Expose
                enableImplicitConversion: true, // Для поддержки конверсии типов, если требуется
            })
        }
        return 'Неправильные данные'
    }

    async giveSubscription(
        accountId: UUID,
        profileId: UUID
    ): Promise<SubscriptionsDTO> {
        const result = await this.prisma.subscription.findFirst({
            where: { authorPid: profileId, subscriberAid: accountId },
        })
        return plainToInstance(SubscriptionsDTO, result, {
            excludeExtraneousValues: true, // Исключить поля без @Expose
        })
    }

    //Ставит подписку или наоборот убирает ее. Большего знать не нужно
    //Передается аккаунт подписчика и профиль подписки
    async subscribe(
        accountId: UUID,
        profileId: UUID
    ): Promise<boolean | string> {
        return this.mutex.lock(accountId, async () => {
            const checkProfile: Profile = await this.prisma.profile.findUnique({
                where: { id: profileId, deleted: false },
            })
            if (!checkProfile) {
                return 'Такого профиля не существует'
            }
            const subscribe: Subscription =
                await this.prisma.subscription.findFirst({
                    where: { authorPid: profileId, subscriberAid: accountId },
                })
            if (!subscribe) {
                await this.prisma.$transaction(async (prisma) => {
                    await prisma.subscription.create({
                        data: {
                            subscriberAid: accountId,
                            authorPid: profileId,
                            createdBy: accountId,
                            active: true,
                        },
                    })
                    await prisma.statsProfile.update({
                        where: { id: checkProfile.statsId },
                        data: { subscribers: { increment: 1 } },
                    })
                })
                return true
            } else if (subscribe.active === true) {
                await this.prisma.$transaction(async (prisma) => {
                    await prisma.subscription.update({
                        where: { id: subscribe.id },
                        data: { active: false, updatedBy: accountId },
                    })
                    await prisma.statsProfile.update({
                        where: { id: checkProfile.statsId },
                        data: { subscribers: { decrement: 1 } },
                    })
                })
                return true
            } else if (subscribe.active === false) {
                await this.prisma.$transaction(async (prisma) => {
                    await prisma.subscription.update({
                        where: { id: subscribe.id },
                        data: { active: true, updatedBy: accountId },
                    })
                    await prisma.statsProfile.update({
                        where: { id: checkProfile.statsId },
                        data: { subscribers: { increment: 1 } },
                    })
                })
                return true
            }
            return false
        })
    }
}
