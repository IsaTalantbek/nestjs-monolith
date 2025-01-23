import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller.js'
import { ProfileService } from './profile.service.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'

@Module({
    imports: [PrismaModule],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
