import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { CookieSettings } from 'src/core/keys/cookie.settings'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { SessionService } from 'src/modules/auth/session/session.service'

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly cookieSettings: CookieSettings,
        private readonly sessionService: SessionService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const reply = context.switchToHttp().getResponse()
        const sessionToken = request.cookies?.aAuthSession
        if (!sessionToken) {
            return false
        }

        const decoded = this.jwtService.verifyAccessToken(sessionToken)
        if (!decoded) {
            reply.clearCookie('aAuthSession')
            return false
        }
        const session = await this.sessionService.getSession(decoded.data)

        if (!session || session.expiresAt < new Date()) {
            reply.clearCookie('aAuthSession')
            return false
        }

        request.user = { accountId: session.accountId }
        return true
    }
}
