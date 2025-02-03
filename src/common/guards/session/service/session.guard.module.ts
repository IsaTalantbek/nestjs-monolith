import { Module } from '@nestjs/common'
import { CookieModule } from '@core/cookie'
import { JwtAuthModule } from '@core/jwt-auth'
import { SessionModule } from '@service/session'
import { SessionUnauthorized } from './session.unauthorized.service.js'
import { SessionCheck } from './session.check.service.js'
import { SessionAuthorized } from './session.authorized.service.js'

@Module({
    imports: [JwtAuthModule, CookieModule, SessionModule],
    providers: [SessionAuthorized, SessionCheck, SessionUnauthorized],
    exports: [SessionAuthorized, SessionCheck, SessionUnauthorized],
})
export class SessionGuardModule {}
