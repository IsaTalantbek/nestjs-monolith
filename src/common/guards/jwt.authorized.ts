import { Injectable } from '@nestjs/common'
import { ExecutionContext, CanActivate } from '@nestjs/common'
import { PrismaService } from 'src/core/database/prisma.service'
import { CookieSettings } from 'src/core/keys/cookie.settings'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { cookieClear } from 'src/common/util/cookie.clear'

@Injectable()
export class JwtAuthorized implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly cookieSettings: CookieSettings
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
                // Токен действителен
                request.user = decoded
                return false
            } else {
                reply.clearCookie(this.cookieSettings.accessTokenName)
            }
        }

        // Если нет действительного access токена, пробуем refresh
        if (refreshToken) {
            const decoded = this.jwtService.verifyRefreshToken(refreshToken)
            if (decoded) {
                const user = await this.prisma.account.findUnique({
                    where: { id: decoded.accountId, deleted: false },
                })
                if (!user) {
                    cookieClear(reply)
                    return true
                }

                const { newAccessToken, data } =
                    this.jwtService.generateAccessToken(user)

                reply.setCookie(
                    this.cookieSettings.accessTokenName,
                    newAccessToken,
                    this.cookieSettings.cookieSettings
                )
                request.user = data
                return false
            }
        }
        reply.clearCookie(this.cookieSettings.refreshTokenName)
        return true
    }
}
