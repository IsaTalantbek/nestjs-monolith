import { PrismaService } from '@core/prisma'
import { Injectable } from '@nestjs/common'
import { Session } from '@prisma/client'
import { MutexService } from '@util/mutex'
import { UUID } from 'crypto'

@Injectable()
export class SessionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexService
    ) {}

    // Получение сессии по ID
    async getSession(sessionId: UUID): Promise<Session> {
        return this.prisma.session.findUnique({
            where: { id: sessionId, deleted: false },
        })
    }
    async getSessions(accountId: UUID): Promise<Session[]> {
        return this.prisma.session.findMany({
            where: { accountId: accountId, deleted: false },
        })
    }
    // Удаление сессии по ID
    async deleteSession(
        accountId: UUID,
        id: UUID,
        headers: string,
        sessionId: UUID
    ): Promise<boolean> {
        return this.mutex.lock(accountId, async () => {
            const date = new Date()
            const user = await this.prisma.session.findUnique({
                where: { id: sessionId },
            })
            if (user && user.superUser === true) {
                await this.prisma.session.update({
                    where: { id: id },
                    data: {
                        deleted: true,
                        deletedAt: date,
                        deletedBy: headers,
                    },
                })
                return true
            }

            await this.prisma.session.update({
                where: { id: id, superUser: false, accountId: accountId },
                data: { deleted: true, deletedAt: date, deletedBy: headers },
            })
            return true
        })
    }

    // Удаление всех сессий пользователя
    async deleteAllSessionsForUser(
        accountId: UUID,
        headers: string,
        sessionId: UUID
    ): Promise<boolean> {
        return this.mutex.lock(accountId, async () => {
            const user = await this.prisma.session.findUnique({
                where: { id: sessionId },
            })
            const date = new Date()
            if (user.superUser === true) {
                await this.prisma.session.updateMany({
                    where: { accountId: accountId },
                    data: {
                        deleted: true,
                        deletedAt: date,
                        deletedBy: headers,
                    },
                })
                return true
            }

            await this.prisma.session.updateMany({
                where: { accountId, superUser: false },
                data: { deleted: true, deletedAt: date, deletedBy: headers },
            })
            return true
        })
    }

    async giveSuperUser(
        accountId: UUID,
        id: UUID,
        sessionId: UUID,
        headers: string
    ): Promise<boolean | string> {
        return this.mutex.lock(accountId, async () => {
            const check = await this.prisma.session.findUnique({
                where: { id: sessionId, superUser: true },
            })
            if (!check) {
                return 'У вас нету роли суперюзера'
            }
            const check2 = await this.prisma.session.findUnique({
                where: { id: id, superUser: false },
            })
            if (!check2) {
                return 'Нету сессии, которой можно передать роль суперюзера'
            }
            await this.prisma.$transaction(async (prisma) => {
                await prisma.session.update({
                    where: { id: id },
                    data: { superUser: false, updatedBy: headers },
                })
                await prisma.session.update({
                    where: { id: sessionId },
                    data: { superUser: true, updatedBy: headers },
                })
            })
            return true
        })
    }
    // Очистка просроченных сессий
    async cleanExpiredSessions(accountId: UUID): Promise<boolean> {
        return this.mutex.lock(accountId, async () => {
            const DATE = new Date().toISOString()
            return this.prisma.$transaction(async (prisma) => {
                const find = await prisma.session.findMany({
                    where: {
                        accountId: accountId,
                        deleted: false,
                        expiresAt: { lt: new Date().toISOString() },
                    },
                })
                const superUserSession = find.find(
                    (session) => session.superUser === true
                )

                if (superUserSession) {
                    // Если суперпользователь среди удаляемых, назначим нового суперпользователя
                    const newSuperUser = await prisma.session.findFirst({
                        where: {
                            accountId: accountId,
                            superUser: false,
                            deleted: false,
                        },
                    })

                    if (newSuperUser) {
                        await prisma.session.update({
                            where: { id: newSuperUser.id },
                            data: {
                                superUser: true,
                                updatedBy: 'SessionService',
                            },
                        })
                    }
                }
                await prisma.session.updateMany({
                    where: {
                        accountId: accountId,
                        expiresAt: { lt: new Date().toISOString() },
                        deleted: false,
                    },
                    data: {
                        deleted: true,
                        deletedAt: DATE,
                        deletedBy: 'SessionService',
                    },
                })
                return true
            })
        })
    }
    async cleanExpiredSession(sessionId: UUID): Promise<boolean> {
        return this.mutex.lock(sessionId, async () => {
            const DATE = new Date().toISOString()
            return this.prisma.$transaction(async (prisma) => {
                const res = await prisma.session.update({
                    where: {
                        id: sessionId,
                        expiresAt: { lt: new Date().toISOString() },
                        deleted: false,
                    },
                    data: {
                        deleted: true,
                        deletedAt: DATE,
                        deletedBy: 'ExpireSession',
                    },
                })
                if (res.superUser === true) {
                    const user = await prisma.session.findFirst({
                        where: {
                            accountId: res.accountId,
                            superUser: false,
                            deleted: false,
                        },
                    })
                    if (!user) {
                        return true
                    }
                    await prisma.session.update({
                        where: { id: user.id },
                        data: { superUser: true, updatedBy: 'SessionService' },
                    })
                }
                return true
            })
        })
    }
}
