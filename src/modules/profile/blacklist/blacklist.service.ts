import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import { Mutex } from 'async-mutex'

@Injectable()
export class BlackLIstService {
    private readonly userLocks = new Map<string, Mutex>()
    constructor(private readonly prisma: PrismaService) {}

    private getMutex(accountId: string): Mutex {
        if (!this.userLocks.has(accountId)) {
            this.userLocks.set(accountId, new Mutex())
        }
        return this.userLocks.get(accountId)!
    }

    async getBlackList(accountId) {
        const result = await this.prisma.blackList.findMany({
            where: { initAid: accountId },
        })
        return result.map(({ vsPid }) => ({ vsPid }))
    }

    async addToBlackList(accountId: string, vsPid: string) {
        const userMutex = this.getMutex(accountId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const ownerCheck = await this.prisma.profile.findFirst({
                where: { ownerId: accountId, id: vsPid, deleted: false },
            })
            if (ownerCheck) {
                return 'Нельзя добавить себя в черный список'
            }

            const check = await this.prisma.account.findUnique({
                where: { id: vsPid },
            })
            if (!check) {
                return 'Пользователя не существует'
            }
            const checkList = await this.prisma.blackList.findUnique({
                where: {
                    initAid_vsPid: {
                        // Указываем составной уникальный ключ
                        initAid: accountId,
                        vsPid: vsPid,
                    },
                },
            })
            if (checkList) {
                if (checkList.active === true) {
                    return 'Вы уже добавили этого человека в черный список'
                }

                await this.prisma.blackList.update({
                    where: {
                        id: checkList.id,
                    },
                    data: { active: true, updatedBy: accountId },
                })
                return true
            }
            await this.prisma.blackList.create({
                data: {
                    initAid: accountId,
                    vsPid: vsPid,
                    createdBy: accountId,
                },
            })
            return true
        } finally {
            release()
        }
    }
    async deleteFromBlackList(accountId: string, vsPid: string) {
        const userMutex = this.getMutex(accountId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const checkList = await this.prisma.blackList.findUnique({
                where: {
                    initAid_vsPid: {
                        // Указываем составной уникальный ключ
                        initAid: accountId,
                        vsPid: vsPid,
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
                    updatedBy: accountId,
                },
            })
            return true
        } finally {
            release()
        }
    }
    async deleteAllFromBlackList(accountId: string) {
        const userMutex = this.getMutex(accountId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const check = await this.prisma.blackList.findFirst({
                where: { initAid: accountId, active: true },
            })
            if (!check) {
                return 'Похоже, ваш черный список пуст'
            }
            await this.prisma.blackList.updateMany({
                where: { initAid: accountId, active: true },
                data: { active: false, updatedBy: accountId },
            })
            return true
        } finally {
            release()
        }
    }
}
