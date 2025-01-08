import { Module } from '@nestjs/common'
import { CookieSettings } from './core/keys/cookie.settings'
import { JwtAuthSettings } from './core/keys/jwt/jwt.auth.settings'
import { JwtService } from './core/keys/jwt/jwt.service'
import { PrismaService } from './core/database/prisma.service'

@Module({
    providers: [CookieSettings, JwtAuthSettings, JwtService, PrismaService],
    exports: [CookieSettings, JwtAuthSettings, JwtService, PrismaService],
})
export class AuthPackModule {}
