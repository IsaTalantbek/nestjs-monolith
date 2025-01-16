import { Global, Module } from '@nestjs/common'
import { CookieSettings } from './core/keys/cookie.settings.js'
import { JwtAuthSettings } from './core/keys/jwt/jwt.auth.settings.js'
import { JwtAuthService } from './core/keys/jwt/jwt.auth.service.js'
import { PrismaService } from './core/database/prisma.service.js'
import { SessionService } from './core/session/session.service.js'
import { MutexManager } from './common/util/mutex.manager.js'

@Global()
@Module({
    providers: [
        CookieSettings,
        JwtAuthSettings,
        JwtAuthService,
        PrismaService,
        SessionService,
        MutexManager,
    ],
    exports: [
        CookieSettings,
        JwtAuthSettings,
        JwtAuthService,
        PrismaService,
        SessionService,
        MutexManager,
    ],
})
export class AuthPackModule {}
