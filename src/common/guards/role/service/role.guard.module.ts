import { Module } from '@nestjs/common'
import { RoleCheck } from './role.check.service.js'
import { PrismaModule } from '../../../../core/database/prisma.module.js'

@Module({
    imports: [PrismaModule],
    providers: [RoleCheck],
    exports: [RoleCheck],
})
export class RoleGuardModule {}
