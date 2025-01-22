import { Injectable } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
    CookieSettings,
    UserData,
    UserDataArray,
} from '../../../core/keys/cookie/cookie.settings.js'
import {
    JwtAccessTokenData,
    JwtAuthService,
    JwtRefreshTokenData,
} from '../../../core/keys/jwt/jwt.auth.service.js'
import { SessionService } from '../../../core/session/session.service.js'
import { BaseGuard } from '../base.guard.js'
import { LoggerService } from '../../log/logger.service.js'
import { UUID } from 'crypto'
import { Session } from '@prisma/client'

@Injectable()
export class SessionAuthorized extends BaseGuard {
    constructor(
        private readonly jwtAuth: JwtAuthService,
        private readonly cookie: CookieSettings,
        private readonly session: SessionService,
        private readonly LoggerService: LoggerService
    ) {
        super(LoggerService)
    }

    private handleSessionExpired(reply: FastifyReply): boolean {
        this.cookie.clearCookie(reply, this.cookie.refreshTokenName)
        return true
    }

    private ifAuthorizedSend(reply: FastifyReply): boolean {
        reply.status(403).send({ message: 'Кажется вы уже авторизованы' })
        return false
    }

    async handleRequest(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<boolean> {
        const accessToken = request.cookies?.[this.cookie.accessTokenName]
        const refreshToken = request.cookies?.[this.cookie.refreshTokenName]

        if (accessToken) {
            const decoded: JwtAccessTokenData =
                this.jwtAuth.verifyAccessToken(accessToken)
            if (decoded) {
                request.user = this.cookie.userData(decoded)
                return this.ifAuthorizedSend(reply)
            } else {
                this.cookie.clearCookie(reply, this.cookie.accessTokenName)
            }
        }

        // Если нет действительного access токена, пробуем refresh
        if (refreshToken) {
            const decoded: JwtRefreshTokenData =
                this.jwtAuth.verifyRefreshToken(refreshToken)
            if (decoded) {
                const sessionId: UUID = decoded.sessionId as UUID
                const session: Session =
                    await this.session.getSession(sessionId)
                if (!session) {
                    return this.handleSessionExpired(reply)
                } else if (session.deleted === true) {
                    this.cookie.clearCookie(reply, this.cookie.refreshTokenName)
                    reply.status(401).send({
                        message:
                            'Вашу сессию кто-то завершил досрочно. Напишите в поддержку, если это сделали не вы',
                    })
                    return false
                } else if (session.expiresAt < new Date()) {
                    this.session.cleanExpiredSession(sessionId)
                    return this.handleSessionExpired(reply)
                }
                const ipPrefix = request.ip.split('.').slice(0, 2).join('.')

                if (
                    ipPrefix !== session.ipAdress ||
                    request.headers['user-agent'] !== session.headers
                ) {
                    return this.handleSessionExpired(reply)
                }

                const accountId: UUID = session.accountId as UUID

                const { newAccessToken } = this.jwtAuth.generateAccessToken(
                    accountId,
                    sessionId
                )

                this.cookie.setCookie(reply, newAccessToken, 'a')
                request.user = this.cookie.userData({
                    accountId: accountId,
                    sessionId: sessionId,
                } as UserData)
                return this.ifAuthorizedSend(reply)
            }
        }
        this.cookie.clearCookie(reply, this.cookie.refreshTokenName)
        return true
    }
}
