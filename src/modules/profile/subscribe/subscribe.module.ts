import { Module } from '@nestjs/common'
import { SubscribeController } from './subscribe.controller.js'
import { SubscribeService } from './subscribe.service.js'
import { AuthPackModule } from '../../../auth.pack.module.js'

@Module({
    imports: [AuthPackModule],
    controllers: [SubscribeController],
    providers: [SubscribeService],
})
export class SubscribeModule {}
