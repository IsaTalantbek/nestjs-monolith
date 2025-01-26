import { Global, Module } from '@nestjs/common'
import { MutexModule } from './core/util/mutex/mutex.module.js'
import { JwtAuthModule } from './core/keys/jwt/jwt.auth.module.js'
import { PrismaModule } from './core/database/prisma.module.js'
import { LoggerModule } from './core/log/logger.module.js'
import { SessionModule } from './core/session/session.module.js'
import { CookieModule } from './core/keys/cookie/cookie.module.js'
import { SessionGuardModule } from './common/guards/session/session.guards.module.js'
import { JwtAuthService } from './core/keys/jwt/jwt.auth.service.js'
import { JwtAuthSettings } from './core/keys/jwt/jwt.auth.settings.js'

@Global()
@Module({
    imports: [LoggerModule, SessionGuardModule],
    exports: [LoggerModule, SessionGuardModule],
})
export class BasePackModule {}
