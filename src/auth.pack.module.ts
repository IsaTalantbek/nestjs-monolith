import { Global, Module } from '@nestjs/common'
import { CookieSettings } from './core/keys/cookie/cookie.settings.js'
import { JwtAuthSettings } from './core/keys/jwt/jwt.auth.settings.js'
import { JwtAuthService } from './core/keys/jwt/jwt.auth.service.js'
import { PrismaService } from './core/database/prisma.service.js'
import { SessionService } from './core/session/session.service.js'
import { MutexManager } from './core/util/mutex.manager.js'
import { LoggerService } from './common/log/logger.service.js'

@Global()
@Module({
    providers: [
        CookieSettings,
        JwtAuthSettings,
        JwtAuthService,
        PrismaService,
        SessionService,
        MutexManager,
        LoggerService,
    ],
    exports: [
        CookieSettings,
        JwtAuthSettings,
        JwtAuthService,
        PrismaService,
        SessionService,
        MutexManager,
        LoggerService,
    ],
})
export class AuthPackModule {}
