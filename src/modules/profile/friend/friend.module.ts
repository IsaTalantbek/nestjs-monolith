import { Module } from '@nestjs/common'
import { FriendController } from './friend.controller'
import { FriendService } from './friend.service'
import { AuthPackModule } from 'src/auth.pack.module'

@Module({
    imports: [AuthPackModule],
    controllers: [FriendController],
    providers: [FriendService],
})
export class FriendModule {}
