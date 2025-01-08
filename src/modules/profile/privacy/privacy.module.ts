import { Module } from '@nestjs/common'
import { PrivacyService } from './privacy.service'
import { PrivacyController } from './privacy.controller'
import { AuthPackModule } from 'src/auth.pack.module'

@Module({
    imports: [AuthPackModule],
    controllers: [PrivacyController],
    providers: [PrivacyService],
})
export class PrivacyModule {}
