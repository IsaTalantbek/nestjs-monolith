import { Module } from '@nestjs/common'
import { CookieSettings } from './core/keys/cookie.settings.js'
import { JwtAuthSettings } from './core/keys/jwt/jwt.auth.settings.js'
import { JwtAuthService } from './core/keys/jwt/jwt.auth.service.js'
import { PrismaService } from './core/database/prisma.service.js'
import { SessionService } from './modules/auth/session/session.service.js'
import { MutexManager } from './common/util/mutex.manager.js'

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
