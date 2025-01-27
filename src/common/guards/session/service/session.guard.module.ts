import { Module } from '@nestjs/common'
import { SessionUnauthorized } from '../service/session.unauthorized.service.js'
import { SessionCheck } from '../service/session.check.service.js'
import { SessionAuthorized } from '../service/session.authorized.service.js'
import { JwtAuthModule } from '../../../../core/keys/jwt/jwt.auth.module.js'
import { CookieModule } from '../../../../core/keys/cookie/cookie.module.js'
import { SessionModule } from '../../../../core/session/session.module.js'

@Module({
    imports: [JwtAuthModule, CookieModule, SessionModule],
    providers: [SessionAuthorized, SessionCheck, SessionUnauthorized],
    exports: [SessionAuthorized, SessionCheck, SessionUnauthorized],
})
export class SessionGuardModule {}
