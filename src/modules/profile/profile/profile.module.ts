import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller.js'
import { ProfileService } from './profile.service.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'
import { RoleGuardModule } from '../../../common/guards/role/service/role.guard.module.js'

@Module({
    imports: [PrismaModule, RoleGuardModule],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
