import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { JwtService } from 'src/core/keys/jwt/jwt.service'

@Injectable()
export class SessionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async createSession(
        accountId: string,
        data: Record<string, any>,
        ipAdress: string,
        headers: string,
        ttl: number = 24 * 60 * 60 * 1000 // Время жизни сессии (по умолчанию 24 часа)
    ): Promise<string> {
        const expiresAt = new Date(Date.now() + ttl)

        const session = await this.prisma.session.create({
            data: {
                accountId,
                data,
                expiresAt,
                ipAdress,
                headers,
            },
        })
        const { newAccessToken } = this.jwtService.generateAccessToken(
            session.id
        )
        return newAccessToken
    }

    async validateUser(login, password): Promise<any> {
        const user = await this.prisma.account.findUnique({ where: { login } })
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user
            return result
        }
        return null
    }
    // Получение сессии по ID
    async getSession(id: string) {
        return this.prisma.session.findUnique({
            where: { id },
        })
    }

    // Удаление сессии по ID
    async deleteSession(id: string) {
        await this.prisma.session.delete({
            where: { id },
        })
    }

    // Удаление всех сессий пользователя
    async deleteAllSessionsForUser(accountId: string) {
        await this.prisma.session.deleteMany({
            where: { accountId },
        })
    }

    // Очистка просроченных сессий
    async cleanExpiredSessions() {
        await this.prisma.session.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            },
        })
    }
    async cleanExpiredSession(id) {
        await this.prisma.session.delete({
            where: {
                id,
                expiresAt: { lt: new Date() },
            },
        })
    }
}
