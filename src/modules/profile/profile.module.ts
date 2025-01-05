import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { JwtTokenService } from 'src/core/keys/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { ProfileService } from './profile.service'

@Module({
    controllers: [ProfileController],
    providers: [JwtTokenService, PrismaService, ProfileService],
})
export class ProfileModule {}
