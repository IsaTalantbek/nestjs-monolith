import { Module } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'
import { IpAdressBlockManager } from '../../core/util/block.manager.js'

@Module({
    controllers: [AuthController],
    providers: [AuthService, IpAdressBlockManager],
})
export class AuthModule {}
