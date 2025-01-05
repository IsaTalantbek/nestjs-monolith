import { Module } from '@nestjs/common'
import { JwtTokenService } from 'src/core/keys/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { PrivacyService } from './privacy.service'
import { PrivacyController } from './privacy.controller'

@Module({
    controllers: [PrivacyController],
    providers: [JwtTokenService, PrismaService, PrivacyService],
})
export class PrivacyModule {}
