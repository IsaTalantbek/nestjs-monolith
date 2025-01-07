import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PrismaService } from '../../core/database/prisma.service'
import { AuthController } from './auth.controller'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { JwtAuthSettings } from 'src/core/keys/jwt/jwt.auth.settings'

@Module({
    imports: [],
    providers: [AuthService, PrismaService, JwtService, JwtAuthSettings],
    controllers: [AuthController],
})
export class AuthModule {}
