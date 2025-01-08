import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AuthPackModule } from 'src/auth.pack.module'

@Module({
    imports: [AuthPackModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
