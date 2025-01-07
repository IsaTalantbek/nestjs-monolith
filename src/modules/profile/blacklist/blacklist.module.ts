import { Module } from '@nestjs/common'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { BlackLIstService } from './blacklist.service'
import { BlackListController } from './blacklist.controller'
import { JwtAuthSettings } from 'src/core/keys/jwt/jwt.auth.settings'

@Module({
    imports: [],
    controllers: [BlackListController],
    providers: [JwtService, PrismaService, BlackLIstService, JwtAuthSettings],
})
export class BlackListModule {}
