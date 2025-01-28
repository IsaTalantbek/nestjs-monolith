import { Module } from '@nestjs/common'
import { SupportController } from './support.controller.js'
import { SupportService } from './support.service.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'
import { RoleGuardModule } from '../../../common/guards/role/service/role.guard.module.js'

@Module({
    imports: [PrismaModule, RoleGuardModule],
    controllers: [SupportController],
    providers: [SupportService],
})
export class SupportModule {}
