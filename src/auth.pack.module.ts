import { Module } from '@nestjs/common'
import { CookieSettings } from './core/keys/cookie.settings'
import { JwtAuthSettings } from './core/keys/jwt/jwt.auth.settings'
import { JwtService } from './core/keys/jwt/jwt.service'
import { PrismaService } from './core/database/prisma.service'
import { SessionService } from './modules/auth/session/session.service'

@Module({
    providers: [
        CookieSettings,
        JwtAuthSettings,
        JwtService,
        PrismaService,
        SessionService,
    ],
    exports: [
        CookieSettings,
        JwtAuthSettings,
        JwtService,
        PrismaService,
        SessionService,
    ],
})
export class AuthPackModule {}
