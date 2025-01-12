import { Module } from '@nestjs/common'
import { FriendController } from './friend.controller.js'
import { FriendService } from './friend.service.js'
import { AuthPackModule } from '../../../auth.pack.module.js'

@Module({
    imports: [AuthPackModule],
    controllers: [FriendController],
    providers: [FriendService],
})
export class FriendModule {}
