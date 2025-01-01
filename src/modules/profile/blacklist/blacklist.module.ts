import { Module } from '@nestjs/common'
import { JwtTokenService } from 'src/core/keys/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { JwtCheck } from 'src/common/guards/jwt.check'
import { BlackLIstService } from './blacklist.service'
import { BlackListController } from './blacklist.controller'

@Module({
    imports: [],
    controllers: [BlackListController],
    providers: [JwtTokenService, PrismaService, BlackLIstService, JwtCheck],
})
export class BlackListModule {}
