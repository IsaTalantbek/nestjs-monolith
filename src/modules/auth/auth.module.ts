import { Module } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'
import { AuthPackModule } from '../../auth.pack.module.js'
import { IpAdressBlockManager } from '../../common/util/block.manager.js'

@Module({
    imports: [AuthPackModule],
    controllers: [AuthController],
    providers: [AuthService, IpAdressBlockManager],
})
export class AuthModule {}
