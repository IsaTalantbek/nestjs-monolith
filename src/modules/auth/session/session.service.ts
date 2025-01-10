import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { CookieSettings } from 'src/core/keys/cookie.settings'

@Injectable()
export class SessionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly cookieSettings: CookieSettings
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
    async deleteSession(id: string, headers: string) {
        const date = new Date()

        await this.prisma.session.update({
            where: { id },
            data: { deleted: true, deletedAt: date, deletedBy: headers },
        })
    }

    // Удаление всех сессий пользователя
    async deleteAllSessionsForUser(accountId: string, headers: string) {
        const date = new Date()

        await this.prisma.session.updateMany({
            where: { accountId },
            data: { deleted: true, deletedAt: date, deletedBy: headers },
        })
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
