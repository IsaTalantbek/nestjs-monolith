import { Module } from '@nestjs/common'
import { JwtTokenService } from 'src/core/keys/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { FriendController } from './friend.controller'
import { FriendService } from './friend.service'

@Module({
    controllers: [FriendController],
    providers: [JwtTokenService, PrismaService, FriendService],
})
export class FriendModule {}
