import { Module } from '@nestjs/common'
import { FriendController } from './friend.controller.js'
import { FriendService } from './friend.service.js'
import { MutexModule } from '../../../core/util/mutex/mutex.module.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'

@Module({
    imports: [PrismaModule, MutexModule],
    controllers: [FriendController],
    providers: [FriendService],
})
export class FriendModule {}
