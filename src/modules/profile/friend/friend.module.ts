import { Module } from '@nestjs/common'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { FriendController } from './friend.controller'
import { FriendService } from './friend.service'
import { JwtAuthSettings } from 'src/core/keys/jwt/jwt.auth.settings'

@Module({
    controllers: [FriendController],
    providers: [JwtService, PrismaService, FriendService, JwtAuthSettings],
})
export class FriendModule {}
