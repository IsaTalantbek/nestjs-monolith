import { Module } from '@nestjs/common'
import { PrivacyService } from './privacy.service.js'
import { PrivacyController } from './privacy.controller.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'

@Module({
    imports: [PrismaModule],
    controllers: [PrivacyController],
    providers: [PrivacyService],
})
export class PrivacyModule {}
