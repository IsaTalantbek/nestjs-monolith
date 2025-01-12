import { Module } from '@nestjs/common'
import { SupportController } from './support.controller.js'
import { SupportService } from './support.service.js'
import { AuthPackModule } from '../../auth.pack.module.js'

@Module({
    imports: [AuthPackModule],
    controllers: [SupportController],
    providers: [SupportService],
})
export class SupportModule {}
