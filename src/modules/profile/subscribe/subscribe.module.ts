import { Module } from '@nestjs/common'
import { SubscribeController } from './subscribe.controller.js'
import { SubscribeService } from './subscribe.service.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'
import { MutexModule } from '../../../core/util/mutex/mutex.module.js'

@Module({
    imports: [PrismaModule, MutexModule],
    controllers: [SubscribeController],
    providers: [SubscribeService],
})
export class SubscribeModule {}
