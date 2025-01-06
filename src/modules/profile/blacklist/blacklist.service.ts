import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import { Mutex } from 'async-mutex'

@Injectable()
export class BlackLIstService {
    private readonly userLocks = new Map<string, Mutex>()
    constructor(private readonly prisma: PrismaService) {}

    private getMutex(userId: string): Mutex {
        if (!this.userLocks.has(userId)) {
            this.userLocks.set(userId, new Mutex())
        }
        return this.userLocks.get(userId)!
    }

    async getBlackList(userId) {
        return await this.prisma.blackList.findMany({
            where: { userId: userId },
        })
    }

    async addToBlackList(userId: string, vsProfileId: string) {
        const userMutex = this.getMutex(userId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const ownerCheck = await this.prisma.profile.findFirst({
                where: { ownerId: userId, id: vsProfileId, deleted: false },
            })
            if (ownerCheck) {
                return 'Нельзя добавить себя в черный список'
            }

            const check = await this.prisma.account.findUnique({
                where: { id: vsProfileId },
            })
            if (!check) {
                return 'Пользователя не существует'
            }
            const checkList = await this.prisma.blackList.findUnique({
                where: {
                    userId_vsProfileId: {
                        // Указываем составной уникальный ключ
                        userId: userId,
                        vsProfileId: vsProfileId,
                    },
                },
            })
            if (checkList) {
                if (checkList.active === true) {
                    return 'Вы уже добавили этого человека в черный список'
                }

                await this.prisma.blackList.update({
                    where: {
                        userId_vsProfileId: {
                            userId: userId,
                            vsProfileId: vsProfileId,
                        },
                    },
                    data: { active: true, updatedBy: userId },
                })
                return true
            }
            await this.prisma.blackList.create({
                data: {
                    userId: userId,
                    vsProfileId: vsProfileId,
                    createdBy: userId,
                },
            })
            return true
        } finally {
            release()
        }
    }
    async deleteFromBlackList(userId: string, vsProfileId: string) {
        const userMutex = this.getMutex(userId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const checkList = await this.prisma.blackList.findUnique({
                where: {
                    userId_vsProfileId: {
                        // Указываем составной уникальный ключ
                        userId: userId,
                        vsProfileId: vsProfileId,
                    },
                },
            })
            if (!checkList) {
                return 'Похоже, вы не добавляли этого человека в черный список'
            }
            if (checkList.active === false) {
                return 'Вы уже разблокировали этого человека'
            }

            await this.prisma.blackList.update({
                where: {
                    id: checkList.id,
                },
                data: {
                    active: false,
                    updatedBy: userId,
                },
            })
            return true
        } finally {
            release()
        }
    }
    async deleteAllFromBlackList(userId: string) {
        const userMutex = this.getMutex(userId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const check = await this.prisma.blackList.findFirst({
                where: { userId: userId, active: true },
            })
            if (!check) {
                return 'Похоже, ваш черный список пуст'
            }
            await this.prisma.blackList.updateMany({
                where: { userId: userId, active: true },
                data: { active: false, updatedBy: userId },
            })
            return true
        } finally {
            release()
        }
    }
}
