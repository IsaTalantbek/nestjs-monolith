import { Injectable } from '@nestjs/common'
import { ExecutionContext, CanActivate } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { errorStatic } from '../../../common/util/error.static.js'
import { CookieSettings } from '../../../core/keys/cookie.settings.js'
import { JwtAuthService } from '../../../core/keys/jwt/jwt.auth.service.js'
import { SessionService } from '../../../modules/auth/session/session.service.js'

@Injectable()
export class JwtCheck implements CanActivate {
    constructor(
        private readonly jwtAuth: JwtAuthService,
        private readonly cookie: CookieSettings,
        private readonly session: SessionService
    ) {}

    private handleSessionExpired(reply: FastifyReply): boolean {
        this.cookie.clearCookie(reply, this.cookie.refreshTokenName)
        return true
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const reply = context.switchToHttp().getResponse()
        try {
            const accessToken = request.cookies?.[this.cookie.accessTokenName]
            const refreshToken = request.cookies?.[this.cookie.refreshTokenName]

            if (accessToken) {
                const decoded = this.jwtAuth.verifyAccessToken(accessToken)
                if (decoded) {
                    request.user = request.user = this.cookie.userData(decoded)
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
            this.cookie.clearCookie(reply, this.cookie.refreshTokenName)
            return true
        } catch (error) {
            errorStatic(error, reply, 'JWT-CHECK', 'проверки сессии')
            return false
        }
    }
}
