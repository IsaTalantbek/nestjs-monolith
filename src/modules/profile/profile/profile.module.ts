import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller.js'
import { ProfileService } from './profile.service.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'
import { RoleGuardModule } from '../../../common/guards/role/service/role.guard.module.js'
import { IpAdressBlockModule } from '../../../core/util/ipAdress/ip.adress.block.module.js'

@Module({
    imports: [PrismaModule, IpAdressBlockModule],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
