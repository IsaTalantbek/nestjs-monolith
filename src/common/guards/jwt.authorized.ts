import { Injectable } from '@nestjs/common'
import { ExecutionContext, CanActivate } from '@nestjs/common'
import { PrismaService } from 'src/core/database/prisma.service'
import { cookieSettings } from 'src/core/keys/cookie.settings'
import { JwtTokenService } from 'src/core/keys/jwt.service'
import { jwtAccessData } from 'src/core/keys/jwt.settings'
import { cookieClear } from 'src/common/util/cookie.clear'

@Injectable()
export class JwtAuthorized implements CanActivate {
    constructor(
        private readonly jwtTokenService: JwtTokenService,
        private readonly prisma: PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const reply = context.switchToHttp().getResponse()

        const accessToken = request.cookies?.aAuthToken
        const refreshToken = request.cookies?.rAuthToken

        if (accessToken) {
            const decoded = this.jwtTokenService.verifyAccessToken(accessToken)
            if (decoded) {
                // Токен действителен
                request.user = decoded
                return false
            } else {
                reply.clearCookie('aAuthToken')
            }
        }

        // Если нет действительного access токена, пробуем refresh
        if (refreshToken) {
            const decoded =
                this.jwtTokenService.verifyRefreshToken(refreshToken)
            if (decoded) {
                const user = await this.prisma.account.findUnique({
                    where: { id: decoded.userId },
                })
                if (!user) {
                    cookieClear(reply)
                    return true
                }
                const payload = jwtAccessData(user)

                const newAccessToken =
                    this.jwtTokenService.generateAccessToken(payload)

                reply.setCookie('aAuthToken', newAccessToken, cookieSettings)
                request.user = jwtAccessData(user)
                return false
            }
        }
        reply.clearCookie('rAuthToken')
        return true
    }
}
