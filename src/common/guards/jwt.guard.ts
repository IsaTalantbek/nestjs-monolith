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

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const reply = context.switchToHttp().getResponse()

        const accessToken =
            request.cookies?.[this.cookieSettings.accessTokenName]
        const refreshToken =
            request.cookies?.[this.cookieSettings.refreshTokenName]
        if (accessToken) {
            const decoded = this.jwtService.verifyAccessToken(accessToken)
            if (decoded) {
                request.user = { accountId: decoded.data }
                return true
            } else {
                reply.clearCookie(this.cookieSettings.accessTokenName)
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
                    reply.clearCookie(this.cookieSettings.refreshTokenName)
                    return false
                }

                const { newAccessToken } = this.jwtService.generateAccessToken(
                    session.accountId
                )

                reply.setCookie(
                    this.cookieSettings.accessTokenName,
                    newAccessToken,
                    this.cookieSettings.cookieSettings
                )
                request.user = { accountId: session.accountId }
                return true
            }
        }
        reply.clearCookie(this.cookieSettings.refreshTokenName)
        return false
    }
}
