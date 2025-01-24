import { Global, Module } from '@nestjs/common'
import { MutexModule } from './core/util/mutex/mutex.module.js'
import { JwtAuthModule } from './core/keys/jwt/jwt.auth.module.js'
import { PrismaModule } from './core/database/prisma.module.js'
import { LoggerModule } from './core/log/logger.module.js'
import { SessionModule } from './core/session/session.module.js'
import { CookieModule } from './core/keys/cookie/cookie.module.js'

@Global()
@Module({
    imports: [
        JwtAuthModule,
        PrismaModule,
        MutexModule,
        LoggerModule,
        SessionModule,
        CookieModule,
    ],
    exports: [JwtAuthModule, CookieModule, SessionModule, LoggerModule],
})
export class BasePackModule {}
