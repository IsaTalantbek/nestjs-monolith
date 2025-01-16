import { Module } from '@nestjs/common'
import { FriendController } from './friend.controller.js'
import { FriendService } from './friend.service.js'

@Module({
    controllers: [FriendController],
    providers: [FriendService],
})
export class FriendModule {}
