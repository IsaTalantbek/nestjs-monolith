import { Module } from '@nestjs/common'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { PrivacyService } from './privacy.service'
import { PrivacyController } from './privacy.controller'
import { JwtAuthSettings } from 'src/core/keys/jwt/jwt.auth.settings'

@Module({
    controllers: [PrivacyController],
    providers: [JwtService, PrismaService, PrivacyService, JwtAuthSettings],
})
export class PrivacyModule {}
