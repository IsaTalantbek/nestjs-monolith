import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PrismaService } from '../../core/database/prisma.service'
import { AuthController } from './auth.controller'
import { JwtTokenService } from 'src/core/keys/jwt.service'
import { JwtAuthorized } from 'src/common/guards/jwt.authorized'

@Module({
    imports: [],
    providers: [AuthService, PrismaService, JwtTokenService, JwtAuthorized],
    controllers: [AuthController],
})
export class AuthModule {}
