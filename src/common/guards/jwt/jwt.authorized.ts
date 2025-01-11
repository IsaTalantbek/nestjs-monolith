import { Injectable } from '@nestjs/common'
import { ExecutionContext, CanActivate } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { errorStatic } from 'src/common/util/error.static'
import { CookieSettings } from 'src/core/keys/cookie.settings'
import { JwtAuthService } from 'src/core/keys/jwt/jwt.auth.service'
import { SessionService } from 'src/modules/auth/session/session.service'

@Injectable()
export class JwtAuthorized implements CanActivate {
    constructor(
        private readonly jwtAuth: JwtAuthService,
        private readonly cookie: CookieSettings,
        private readonly session: SessionService
    ) {}

    private handleSessionExpired(reply: FastifyReply): boolean {
        this.cookie.clearCookie(reply, this.cookie.refreshTokenName)
        return true
    }

    private ifAuthorizedSend(reply: FastifyReply): boolean {
        reply.status(403).send({ message: 'Кажется вы уже авторизованы' })
        return false
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
                    request.user = {
                        accountId: decoded.data[0],
                        sessionId: decoded.data[1],
                    }
                    return this.ifAuthorizedSend(reply)
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

                    reply.setCookie(
                        this.cookie.accessTokenName,
                        newAccessToken,
                        this.cookie.cookieSettings
                    )
                    request.user = {
                        accountId: session.accountId,
                        sessionId: session.id,
                    }
                    return this.ifAuthorizedSend(reply)
                }
            }
            reply.clearCookie(this.cookie.refreshTokenName)
            return true
        } catch (error) {
            errorStatic(error, reply, 'JWT-AUTHORIZED', 'проверки авторизации')
            return false
        }
    }
}
