import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller.js'
import { ProfileService } from './profile.service.js'
import { AuthPackModule } from '../../auth.pack.module.js'

@Module({
    imports: [AuthPackModule],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
