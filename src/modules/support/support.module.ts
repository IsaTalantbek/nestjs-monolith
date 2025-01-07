import { Module } from '@nestjs/common'
import { SupportController } from './support.controller'
import { PrismaService } from 'src/core/database/prisma.service'
import { SupportService } from './support.service'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { JwtAuthSettings } from 'src/core/keys/jwt/jwt.auth.settings'

@Module({
    controllers: [SupportController],
    providers: [PrismaService, SupportService, JwtService, JwtAuthSettings],
})
export class SupportModule {}
