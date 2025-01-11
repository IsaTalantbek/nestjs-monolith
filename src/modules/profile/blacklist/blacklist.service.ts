import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import { MutexManager } from 'src/common/util/mutex.manager'
import { vsPidBlacklistDto } from './blacklist.dto'

@Injectable()
export class BlackLIstService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexManager
    ) {}

    async getBlackList(accountId) {
        const result = await this.prisma.blackList.findMany({
            where: { initAid: accountId },
        })
        return result.map(({ vsPid }) => ({ vsPid }))
    }

    async addToBlackList({ accountId, vsPid }: vsPidBlacklistDto) {
        return this.mutex.blockWithMutex(accountId, async () => {
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
        })
    }

    async deleteFromBlackList({ accountId, vsPid }: vsPidBlacklistDto) {
        return this.mutex.blockWithMutex(accountId, async () => {
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
        })
    }

    async deleteAllFromBlackList(accountId: string) {
        return this.mutex.blockWithMutex(accountId, async () => {
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
        })
    }
}
