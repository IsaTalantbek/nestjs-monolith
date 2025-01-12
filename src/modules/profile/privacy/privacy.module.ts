import { Module } from '@nestjs/common'
import { PrivacyService } from './privacy.service.js'
import { PrivacyController } from './privacy.controller.js'
import { AuthPackModule } from '../../../auth.pack.module.js'

@Module({
    imports: [AuthPackModule],
    controllers: [PrivacyController],
    providers: [PrivacyService],
})
export class PrivacyModule {}
