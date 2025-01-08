import { Module } from '@nestjs/common'
import { SubscribeController } from './subscribe.controller'
import { SubscribeService } from './subscribe.service'
import { AuthPackModule } from 'src/auth.pack.module'

@Module({
    imports: [AuthPackModule],
    controllers: [SubscribeController],
    providers: [SubscribeService],
})
export class SubscribeModule {}
