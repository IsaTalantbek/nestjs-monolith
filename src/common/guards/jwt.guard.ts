import { Injectable } from '@nestjs/common'
import { ExecutionContext, CanActivate } from '@nestjs/common'
import { PrismaService } from 'src/core/database/prisma.service'
import { cookieSettings } from 'src/core/keys/cookie.settings'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { cookieClear } from 'src/common/util/cookie.clear'

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const reply = context.switchToHttp().getResponse()

        const accessToken = request.cookies?.aAuthToken
        const refreshToken = request.cookies?.rAuthToken

        if (accessToken) {
            const decoded = this.jwtService.verifyAccessToken(accessToken)
            if (decoded) {
                request.user = decoded
                return true
            } else {
                reply.clearCookie('aAuthToken')
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
                    return false
                }

                const { newAccessToken, data } =
                    this.jwtService.generateAccessToken(user)

                reply.setCookie('aAuthToken', newAccessToken, cookieSettings)
                request.user = data
                return true
            }
        }
        reply.clearCookie('rAuthToken')
        return false
    }
}
