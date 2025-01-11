import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AuthPackModule } from 'src/auth.pack.module'
import { MutexManager } from 'src/common/util/mutex.manager'
import { IpAdressBlockManager } from 'src/common/util/block.manager'

@Module({
    imports: [AuthPackModule],
    controllers: [AuthController],
    providers: [AuthService, IpAdressBlockManager],
})
export class AuthModule {}
