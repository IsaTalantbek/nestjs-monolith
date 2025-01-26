import { Injectable } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
    CookieService,
    UserData,
} from '../../../../core/keys/cookie/cookie.service.js'
import {
    JwtAccessTokenData,
    JwtAuthService,
    JwtRefreshTokenData,
} from '../../../../core/keys/jwt/jwt.auth.service.js'
import { SessionService } from '../../../../core/session/session.service.js'
import { UUID } from 'crypto'

@Injectable()
export class SessionUnauthorired {
    constructor(
        private readonly jwtAuth: JwtAuthService,
        private readonly cookie: CookieService,
        private readonly session: SessionService
    ) {}

    private handleSessionExpired(reply: FastifyReply): boolean {
        this.cookie.clearCookie(reply, this.cookie.refreshTokenName)
        reply.status(401).send({
            message: 'Ваш сеанс истек. Пожалуйста, войдите снова',
        })
        return false
    }

    async use(reply: FastifyReply, req: FastifyRequest): Promise<boolean> {
        const accessToken = req.cookies?.[this.cookie.accessTokenName]
        const refreshToken = req.cookies?.[this.cookie.refreshTokenName]

        if (accessToken) {
            const decoded: JwtAccessTokenData =
                await this.jwtAuth.verifyAccessToken(accessToken)
            if (decoded) {
                req.user = this.cookie.userData(decoded)
                return true
            } else {
                this.cookie.clearCookie(reply, this.cookie.accessTokenName)
            }
        }

        // Если нет действительного access токена, пробуем refresh
        if (refreshToken) {
            const decoded: JwtRefreshTokenData =
                await this.jwtAuth.verifyRefreshToken(refreshToken)
            if (decoded) {
                const sessionId: UUID = decoded.sessionId as UUID
                const session = await this.session.getSession(sessionId)
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
                const ipPrefix = req.ip.split('.').slice(0, 2).join('.')

                if (
                    ipPrefix !== session.ipAdress ||
                    req.headers['user-agent'] !== session.headers
                ) {
                    return this.handleSessionExpired(reply)
                }

                const accountId: UUID = session.accountId as UUID

                const { newAccessToken } =
                    await this.jwtAuth.generateAccessToken(accountId, sessionId)

                this.cookie.setCookie(reply, newAccessToken, 'a')
                req.user = this.cookie.userData({
                    accountId: accountId,
                    sessionId: sessionId,
                } as UserData)
                return true
            }
        }
        this.cookie.clearCookie(reply, this.cookie.refreshTokenName)
        reply.status(401).send({ message: 'Вы не авторизованы' })
        return false
    }
}
