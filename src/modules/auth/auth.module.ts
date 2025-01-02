import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { JwtStrategy } from '../../core/keys/jwt.strategy'
import { PrismaService } from '../../core/database/prisma.service'
import { AuthController } from './auth.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtTokenService } from 'src/core/keys/jwt.service'

@Module({
    imports: [],
    providers: [AuthService, PrismaService, JwtTokenService],
    controllers: [AuthController],
})
export class AuthModule {}
