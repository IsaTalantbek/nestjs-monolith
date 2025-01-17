import { Injectable } from '@nestjs/common'
import { ExecutionContext, CanActivate } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { errorStatic } from '../../../core/util/error.static.js'
import { CookieSettings } from '../../../core/keys/cookie/cookie.settings.js'
import { JwtAuthService } from '../../../core/keys/jwt/jwt.auth.service.js'
import { SessionService } from '../../../core/session/session.service.js'
import { BaseGuard } from '../base.guard.js'

@Injectable()
export class SessionGuard extends BaseGuard {
    constructor(
        private readonly jwtAuth: JwtAuthService,
        private readonly cookie: CookieSettings,
        private readonly session: SessionService
    ) {
        super()
    }

    private handleSessionExpired(reply: FastifyReply): boolean {
        this.cookie.clearCookie(reply, this.cookie.refreshTokenName)
        reply.status(401).send({
            message: 'Ваш сеанс истек. Пожалуйста, войдите снова',
        })
        return false
    }

    async handleRequest(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<boolean> {
        const accessToken = request.cookies?.[this.cookie.accessTokenName]
        const refreshToken = request.cookies?.[this.cookie.refreshTokenName]

        if (accessToken) {
            const decoded = this.jwtAuth.verifyAccessToken(accessToken)
            if (decoded) {
                request.user = this.cookie.userData(decoded)
                return true
            } else {
                this.cookie.clearCookie(reply, this.cookie.accessTokenName)
            }
        }

        // Если нет действительного access токена, пробуем refresh
        if (refreshToken) {
            const decoded = this.jwtAuth.verifyRefreshToken(refreshToken)
            if (decoded) {
                const session = await this.session.getSession(decoded.data)

                if (!session || session.expiresAt < new Date()) {
                    this.session.cleanExpiredSession(session.id)
                    return this.handleSessionExpired(reply)
                }
                const ipPrefix = request.ip.split('.').slice(0, 2).join('.')

                if (
                    ipPrefix !== session.ipAdress ||
                    request.headers['user-agent'] !== session.headers
                ) {
                    return this.handleSessionExpired(reply)
                }

                const { newAccessToken } = this.jwtAuth.generateAccessToken(
                    session.accountId,
                    session.id
                )

                this.cookie.setCookie(reply, newAccessToken, 'a')
                request.user = this.cookie.userData(session)
                return true
            }
        }
        this.cookie.clearCookie(this.cookie.refreshTokenName)
        reply.status(401).send({ message: 'Вы не авторизованы' })
        return false
    }
}
