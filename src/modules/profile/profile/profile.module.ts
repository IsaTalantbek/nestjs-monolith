import { Module } from '@nestjs/common'
import { IpAdressBlockModule } from '@util/ip-block'
import { PrismaModule } from '@core/prisma'
import { ProfileController } from './profile.controller.js'
import { ProfileService } from './profile.service.js'

@Module({
    imports: [PrismaModule, IpAdressBlockModule],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
