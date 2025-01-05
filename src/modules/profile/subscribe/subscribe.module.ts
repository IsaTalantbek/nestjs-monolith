import { Module } from '@nestjs/common'
import { JwtTokenService } from 'src/core/keys/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { SubscribeController } from './subscribe.controller'
import { SubscribeService } from './subscribe.service'

@Module({
    controllers: [SubscribeController],
    providers: [JwtTokenService, PrismaService, SubscribeService],
})
export class SubscribeModule {}
