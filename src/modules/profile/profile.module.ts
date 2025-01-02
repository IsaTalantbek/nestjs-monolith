import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { JwtTokenService } from 'src/core/keys/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { ProfileService } from './profile.service'
import { BlackListModule } from './blacklist/blacklist.module'

@Module({
    imports: [BlackListModule],
    controllers: [ProfileController],
    providers: [JwtTokenService, PrismaService, ProfileService],
})
export class ProfileModule {}
