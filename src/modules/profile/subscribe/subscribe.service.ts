import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import * as _ from 'lodash'
import { Mutex } from 'async-mutex'

@Injectable()
export class SubscribeService {
    private readonly userLocks = new Map<string, Mutex>()
    constructor(private readonly prisma: PrismaService) {}

    private getMutex(userId: string): Mutex {
        if (!this.userLocks.has(userId)) {
            this.userLocks.set(userId, new Mutex())
        }
        return this.userLocks.get(userId)!
    }

    async getSubscribe(userId?: string, userProfileId?: string) {
        if (userId) {
            const result = await this.prisma.subscribe.findMany({
                where: { subscriberAid: userId, active: true },
            })
            return result.map((sub) =>
                _.pick(sub, 'subscribesAid', 'authorPid')
            )
        } else if (userProfileId) {
            const result = await this.prisma.subscribe.findMany({
                where: { authorPid: userProfileId, active: true },
            })
            return result.map((sub) =>
                _.pick(sub, 'subscribesAid', 'authorPid')
            )
        }
        return 'Неправильные данные'
    }
    async subscribe(userId: string, userProfileId: string) {
        const userMutex = this.getMutex(userId)
        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const checkProfile = await this.prisma.profile.findUnique({
                where: { id: userProfileId, deleted: false },
            })
            if (!checkProfile) {
                return 'Такого профиля не существует'
            }
            const subscribe = await this.prisma.subscribe.findFirst({
                where: { authorPid: userProfileId, subscriberAid: userId },
            })
            if (!subscribe) {
                await this.prisma.$transaction(async (prisma) => {
                    await prisma.subscribe.create({
                        data: {
                            subscriberAid: userId,
                            authorPid: userProfileId,
                            createdBy: userId,
                            active: true,
                        },
                    })
                    await prisma.profile.update({
                        where: { id: userProfileId },
                        data: { subscribers: { increment: 1 } },
                    })
                })
                return true
            } else if (subscribe.active === true) {
                await this.prisma.$transaction(async (prisma) => {
                    await prisma.subscribe.update({
                        where: { id: subscribe.id },
                        data: { active: false, updatedBy: userId },
                    })
                    await prisma.profile.update({
                        where: { id: userProfileId },
                        data: { subscribers: { decrement: 1 } },
                    })
                })
                return true
            } else if (subscribe.active === false) {
                await this.prisma.$transaction(async (prisma) => {
                    await prisma.subscribe.update({
                        where: { id: subscribe.id },
                        data: { active: true, updatedBy: userId },
                    })
                    await prisma.profile.update({
                        where: { id: userProfileId },
                        data: { subscribers: { decrement: 1 } },
                    })
                })
                return true
            }
            return false
        } finally {
            release()
        }
    }
}
