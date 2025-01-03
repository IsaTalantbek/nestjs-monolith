import { Module } from '@nestjs/common'
import { SupportController } from './support.controller'
import { PrismaService } from 'src/core/database/prisma.service'
import { SupportService } from './support.service'
import { JwtTokenService } from 'src/core/keys/jwt.service'

@Module({
    controllers: [SupportController],
    providers: [PrismaService, SupportService, JwtTokenService],
})
export class SupportModule {}
