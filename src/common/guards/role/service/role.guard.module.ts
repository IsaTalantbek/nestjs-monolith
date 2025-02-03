import { Module } from '@nestjs/common'
import { PrismaModule } from '@core/prisma'
import { RoleCheck } from './role.check.service.js'

@Module({
    imports: [PrismaModule],
    providers: [RoleCheck],
    exports: [RoleCheck],
})
export class RoleGuardModule {}
