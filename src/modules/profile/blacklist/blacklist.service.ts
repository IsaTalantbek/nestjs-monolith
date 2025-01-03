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

    async giveBlackList(userId) {
        const userMutex = this.getMutex(userId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const result = await this.prisma.blackList.findMany({
                where: { userId: userId },
            })
            if (!result) {
                return 'Похоже, черный список пуст'
            }
            return result
        } finally {
            release()
        }
    }

    async addToBlackList(userId: string, vsUserId: string) {
        const userMutex = this.getMutex(userId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            if (userId === vsUserId) {
                return 'Нельзя добавить себя в черный список'
            }
            const checkList = await this.prisma.blackList.findUnique({
                where: {
                    userId_vsUserId: {
                        // Указываем составной уникальный ключ
                        userId: userId,
                        vsUserId: vsUserId,
                    },
                },
            })
            if (checkList.active === true) {
                return 'Вы уже добавили этого человека в черный список'
            }
            if (checkList) {
                await this.prisma.blackList.update({
                    where: {
                        userId_vsUserId: {
                            userId: userId,
                            vsUserId: vsUserId,
                        },
                    },
                    data: { active: true, updateBy: 'BlackListService' },
                })
                return true
            }
            const check = await this.prisma.account.findUnique({
                where: { id: vsUserId },
            })
            if (!check) {
                return 'Пользователя не существует'
            }
            await this.prisma.blackList.create({
                data: { userId, vsUserId, createBy: 'BlackListService' },
            })
            return true
        } finally {
            release()
        }
    }
    async removeToBlackList(userId: string, vsUserId: string) {
        const userMutex = this.getMutex(userId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const checkList = await this.prisma.blackList.findUnique({
                where: {
                    userId_vsUserId: {
                        // Указываем составной уникальный ключ
                        userId: userId,
                        vsUserId: vsUserId,
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
                    userId_vsUserId: {
                        userId: userId,
                        vsUserId: vsUserId,
                    },
                },
                data: {
                    active: false,
                    updateBy: 'BlackListService',
                },
            })
            return true
        } finally {
            release()
        }
    }
    async removeAllToBlackList(userId: string) {
        const userMutex = this.getMutex(userId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const check = await this.prisma.blackList.findFirst({
                where: { AND: [{ userId: userId }, { active: true }] },
            })
            if (!check) {
                return 'Похоже, ваш черный список пуст'
            }
            await this.prisma.blackList.updateMany({
                where: { userId: userId },
                data: { active: false, updateBy: 'BlackListService' },
            })
            return true
        } finally {
            release()
        }
    }
}
