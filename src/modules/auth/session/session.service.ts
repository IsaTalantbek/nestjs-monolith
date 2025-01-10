import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import { JwtService } from 'src/core/keys/jwt/jwt.service'

@Injectable()
export class SessionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
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
    async deleteSession(accountId: string, id: string, headers: string) {
        const date = new Date()

        await this.prisma.session.update({
            where: { id, superUser: false, accountId },
            data: { deleted: true, deletedAt: date, deletedBy: headers },
        })
    }

    // Удаление всех сессий пользователя
    async deleteAllSessionsForUser(accountId: string, headers: string) {
        const date = new Date()

        await this.prisma.session.updateMany({
            where: { accountId, superUser: false },
            data: { deleted: true, deletedAt: date, deletedBy: headers },
        })
    }

    async giveSuperUser(
        accountId: string,
        userSessionId: string,
        sessionId: string,
        headers: string
    ) {
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
                where: { id: userSessionId },
                data: { superUser: false, updatedBy: headers },
            })
            await prisma.session.update({
                where: { id: sessionId },
                data: { superUser: true, updatedBy: headers },
            })
        })
        return true
    }
    // Очистка просроченных сессий
    async cleanExpiredSessions(accountId) {
        const date = new Date()

        await this.prisma.session.updateMany({
            where: {
                accountId,
                expiresAt: { lt: new Date() },
            },
            data: {
                deleted: true,
                deletedAt: date,
                deletedBy: 'ExpireSession',
            },
        })
    }
    async cleanExpiredSession(id) {
        const date = new Date()

        await this.prisma.session.update({
            where: {
                id,
                expiresAt: { lt: new Date() },
            },
            data: {
                deleted: true,
                deletedAt: date,
                deletedBy: 'ExpireSession',
            },
        })
    }
}
