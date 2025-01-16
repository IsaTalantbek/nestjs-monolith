import { Module } from '@nestjs/common'
import { SubscribeController } from './subscribe.controller.js'
import { SubscribeService } from './subscribe.service.js'

@Module({
    controllers: [SubscribeController],
    providers: [SubscribeService],
})
export class SubscribeModule {}
