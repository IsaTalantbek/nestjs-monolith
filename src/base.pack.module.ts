import { Global, Module } from '@nestjs/common'
import { CookieSettings } from './core/keys/cookie/cookie.settings.js'
import { SessionService } from './core/session/session.service.js'
import { LoggerService } from './common/log/logger.service.js'
import { MutexModule } from './core/util/mutex/mutex.module.js'
import { JwtAuthModule } from './core/keys/jwt/jwt.auth.module.js'
import { PrismaModule } from './core/database/prisma.module.js'

@Global()
@Module({
    imports: [JwtAuthModule, PrismaModule, MutexModule],
    providers: [CookieSettings, SessionService, LoggerService],
    exports: [CookieSettings, JwtAuthModule, SessionService, LoggerService],
})
export class BasePackModule {}
