import { Injectable } from '@nestjs/common'
import { ExecutionContext, CanActivate } from '@nestjs/common'
import { CookieSettings } from 'src/core/keys/cookie.settings'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { SessionService } from 'src/modules/auth/session/session.service'

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly cookieSettings: CookieSettings,
        private readonly sessionService: SessionService
    ) {}

    private handleSessionExpired(reply): boolean {
        reply.clearCookie(this.cookieSettings.refreshTokenName)
        reply.status(401).send({
            message: 'Ваш сеанс истек. Пожалуйста, войдите снова',
        })
        return false
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const reply = context.switchToHttp().getResponse()
        try {
            const accessToken =
                request.cookies?.[this.cookieSettings.accessTokenName]
            const refreshToken =
                request.cookies?.[this.cookieSettings.refreshTokenName]
            if (accessToken) {
                const decoded = this.jwtService.verifyAccessToken(accessToken)
                if (decoded) {
                    request.user = {
                        accountId: decoded.data[0],
                        sessionId: decoded.data[1],
                    }
                    return true
                } else {
                    this.cookieSettings.clearCookie(
                        reply,
                        this.cookieSettings.accessTokenName
                    )
                }
            }

            // Если нет действительного access токена, пробуем refresh
            if (refreshToken) {
                const decoded = this.jwtService.verifyRefreshToken(refreshToken)
                if (decoded) {
                    const session = await this.sessionService.getSession(
                        decoded.data
                    )

                    if (!session || session.expiresAt < new Date()) {
                        this.sessionService.cleanExpiredSession(session.id)
                        return this.handleSessionExpired(reply)
                    }
                    const ipPrefix = request.ip.split('.').slice(0, 2).join('.')

                    if (
                        ipPrefix !== session.ipAdress ||
                        request.headers['user-agent'] !== session.headers
                    ) {
                        return this.handleSessionExpired(reply)
                    }

                    const { newAccessToken } =
                        this.jwtService.generateAccessToken(
                            session.accountId,
                            session.id
                        )

                    reply.setCookie(
                        this.cookieSettings.accessTokenName,
                        newAccessToken,
                        this.cookieSettings.cookieSettings
                    )
                    request.user = {
                        accountId: session.accountId,
                        sessionId: session.id,
                    }
                    return true
                }
            }
            reply.clearCookie(this.cookieSettings.refreshTokenName)
            reply.status(401).send({ message: 'Вы не авторизованы' })
            return false
        } catch (error) {
            console.error(`JWT-GUARD: ${error}`)
            reply.status(500).send({
                message:
                    'Произошла ошибка при попытке аутентификации. Пожалуйста, сообщите нам подробности',
            })
            return false
        }
    }
}
