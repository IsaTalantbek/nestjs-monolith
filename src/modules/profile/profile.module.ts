import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { ProfileService } from './profile.service'
import { JwtAuthSettings } from 'src/core/keys/jwt/jwt.auth.settings'

@Module({
    controllers: [ProfileController],
    providers: [JwtService, PrismaService, ProfileService, JwtAuthSettings],
})
export class ProfileModule {}
