import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PrismaService } from '../../core/database/prisma.service'
import { AuthController } from './auth.controller'

@Module({
    providers: [AuthService, PrismaService],
    controllers: [AuthController],
})
export class AuthModule {}
