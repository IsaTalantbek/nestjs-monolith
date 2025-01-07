import { Module } from '@nestjs/common'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { SubscribeController } from './subscribe.controller'
import { SubscribeService } from './subscribe.service'
import { JwtAuthSettings } from 'src/core/keys/jwt/jwt.auth.settings'

@Module({
    controllers: [SubscribeController],
    providers: [JwtService, PrismaService, SubscribeService, JwtAuthSettings],
})
export class SubscribeModule {}
