import { Module } from '@nestjs/common'
import { CookieSettings } from './core/keys/cookie.settings'
import { JwtAuthSettings } from './core/keys/jwt/jwt.auth.settings'
import { JwtAuthService } from './core/keys/jwt/jwt.auth.service'
import { PrismaService } from './core/database/prisma.service'
import { SessionService } from './modules/auth/session/session.service'
import { MutexManager } from './common/util/mutex.manager'

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
