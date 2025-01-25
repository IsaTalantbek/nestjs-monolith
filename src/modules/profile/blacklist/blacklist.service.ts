import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service.js'
import { MutexService } from '../../../core/util/mutex/mutex.service.js'
import { GiveBlacklistDTO } from './sample/blacklist.dto.js'
import { UUID } from 'crypto'
import { BlackList, Profile } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { BlacklistService_INTERFACE } from './sample/blacklist.interface.js'

@Injectable()
export class BlacklistService implements BlacklistService_INTERFACE {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexService
    ) {}

    async giveBlacklist(accountId: UUID): Promise<GiveBlacklistDTO[]> {
        const result: BlackList[] = await this.prisma.blackList.findMany({
            where: { initAid: accountId },
        })
        return plainToInstance(GiveBlacklistDTO, result, {
            excludeExtraneousValues: true, // Исключить поля без @Expose
        })
    }

    async addToBlacklist(accountId: UUID, vsPid: UUID): Promise<true | string> {
        return this.mutex.lock(accountId, async () => {
            const check: Profile | null = await this.prisma.profile.findUnique({
                where: { id: vsPid },
            })
            if (!check) {
                return 'Такого профиля не существует'
            } else if (check.ownerId === accountId) {
                return 'Вы не можете добавить в черный список свой профиль'
            }
            const checkList: BlackList | null =
                await this.prisma.blackList.findUnique({
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

    async deleteToBlacklist(
        accountId: UUID,
        vsPid: UUID
    ): Promise<true | string> {
        return this.mutex.lock(accountId, async () => {
            const checkList: BlackList | null =
                await this.prisma.blackList.findUnique({
                    where: {
                        initAid_vsPid: {
                            // Указываем составной уникальный ключ
                            initAid: accountId,
                            vsPid: vsPid,
                        },
                    },
                })
            if (!checkList) {
                return 'Похоже, вы не добавляли этого пользователя в черный список'
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

    async deleteAllToBlacklist(accountId: UUID): Promise<true | string> {
        return this.mutex.lock(accountId, async () => {
            const check: BlackList | null =
                await this.prisma.blackList.findFirst({
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
