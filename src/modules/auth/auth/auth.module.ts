import { Module } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'
import { MutexModule } from '../../../core/util/mutex/mutex.module.js'
import { IpAdressBlockModule } from '../../../core/util/block/block.module.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'

@Module({
    imports: [MutexModule, IpAdressBlockModule, PrismaModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
