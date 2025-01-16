import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service.js'
import * as _ from 'lodash'
import { MutexManager } from '../../../core/util/mutex.manager.js'

@Injectable()
export class SubscribeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexManager
    ) {}

    //Если передан userPid, возвращает все подписки которые оформлены на этот профиль
    //Если передан accountId, возвращает все подписки этого аккаунта
    async getSubscribe(accountId?: string, userPid?: string) {
        if (userPid) {
            const result = await this.prisma.subscribe.findMany({
                where: { authorPid: userPid, active: true },
            })
            return result.map(({ subscriberAid }) => ({ subscriberAid }))
        } else if (accountId) {
            const result = await this.prisma.subscribe.findMany({
                where: { subscriberAid: accountId, active: true },
            })
            return result.map(({ authorPid }) => ({ authorPid }))
        }
        return 'Неправильные данные'
    }
    //Ставит подписку или наоборот убирает ее. Большего знать не нужно
    //Передается аккаунт подписчика и профиль подписки
    async subscribe(
        accountId: string,
        userPid: string
    ): Promise<boolean | string> {
        return this.mutex.lock(accountId, async () => {
            const checkProfile = await this.prisma.profile.findUnique({
                where: { id: userPid, deleted: false },
            })
            if (!checkProfile) {
                return 'Такого профиля не существует'
            }
            const subscribe = await this.prisma.subscribe.findFirst({
                where: { authorPid: userPid, subscriberAid: accountId },
            })
            if (!subscribe) {
                await this.prisma.$transaction(async (prisma) => {
                    await prisma.subscribe.create({
                        data: {
                            subscriberAid: accountId,
                            authorPid: userPid,
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
                    await prisma.subscribe.update({
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
                    await prisma.subscribe.update({
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
