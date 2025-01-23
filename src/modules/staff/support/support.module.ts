import { Module } from '@nestjs/common'
import { SupportController } from './support.controller.js'
import { SupportService } from './support.service.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'

@Module({
    imports: [PrismaModule],
    controllers: [SupportController],
    providers: [SupportService],
})
export class SupportModule {}
