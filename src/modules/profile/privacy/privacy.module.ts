import { Module } from '@nestjs/common'
import { PrivacyService } from './privacy.service.js'
import { PrivacyController } from './privacy.controller.js'

@Module({
    controllers: [PrivacyController],
    providers: [PrivacyService],
})
export class PrivacyModule {}
