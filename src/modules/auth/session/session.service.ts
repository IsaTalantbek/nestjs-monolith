import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { MutexManager } from 'src/common/util/mutex.manager'

@Injectable()
export class SessionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly mutex: MutexManager
    ) {}

    async createSession({ data }): Promise<string> {
        const session = await this.prisma.session.create({
            data: data,
        })
        const { newAccessToken } = this.jwtService.generateAccessToken(
            session.id
        )
        return newAccessToken
    }

    // Получение сессии по ID
    async getSession(id: string) {
        return this.prisma.session.findUnique({
            where: { id, deleted: false },
        })
    }
    async getSessions(accountId: string) {
        return this.prisma.session.findMany({
            where: { accountId, deleted: false },
        })
    }
    // Удаление сессии по ID
    async deleteSession(
        accountId: string,
        id: string,
        headers: string,
        sessionId: string
    ): Promise<boolean> {
        return this.mutex.blockWithMutex(accountId, async () => {
            const date = new Date()
            const user = await this.prisma.session.findUnique({
                where: { id: sessionId },
            })
            if (user && user.superUser === true) {
                await this.prisma.session.update({
                    where: { id, accountId },
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
        accountId: string,
        headers: string,
        sessionId: string
    ): Promise<boolean> {
        return this.mutex.blockWithMutex(accountId, async () => {
            const user = await this.prisma.session.findUnique({
                where: { id: sessionId },
            })
            const date = new Date()
            if (user.superUser === true) {
                await this.prisma.session.updateMany({
                    where: { accountId },
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
        accountId: string,
        id: string,
        sessionId: string,
        headers: string
    ): Promise<boolean | string> {
        return this.mutex.blockWithMutex(accountId, async () => {
            const check = await this.prisma.session.findUnique({
                where: { id: sessionId, superUser: true, accountId },
            })
            if (!check) {
                return 'У вас нету роли суперюзера'
            }
            const check2 = await this.prisma.session.findUnique({
                where: { id: sessionId, superUser: false, accountId },
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
    async cleanExpiredSessions(accountId) {
        return this.mutex.blockWithMutex(accountId, async () => {
            const date = new Date()
            await this.prisma.$transaction(async (prisma) => {
                const find = await prisma.session.findMany({
                    where: {
                        accountId,
                        deleted: false,
                        expiresAt: { lt: new Date() },
                    },
                })
                const superUserSession = find.find(
                    (session) => session.superUser === true
                )

                if (superUserSession) {
                    // Если суперпользователь среди удаляемых, назначим нового суперпользователя
                    const newSuperUser = await prisma.session.findFirst({
                        where: {
                            accountId,
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
                        accountId,
                        expiresAt: { lt: new Date() },
                        deleted: false,
                    },
                    data: {
                        deleted: true,
                        deletedAt: date,
                        deletedBy: 'ExpireSession',
                    },
                })
                return true
            })
        })
    }
    async cleanExpiredSession(id) {
        return this.mutex.blockWithMutex(id, async () => {
            const date = new Date()
            await this.prisma.$transaction(async (prisma) => {
                const res = await prisma.session.update({
                    where: {
                        id,
                        expiresAt: { lt: new Date() },
                        deleted: false,
                    },
                    data: {
                        deleted: true,
                        deletedAt: date,
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
            })
            return true
        })
    }
}
