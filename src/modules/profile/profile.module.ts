import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { JwtTokenService } from 'src/core/keys/jwt.service'
import { PrismaService } from 'src/core/database/prisma.service'
import { ProfileService } from './profile.service'
import { JwtGuard } from 'src/common/guards/jwt.guard'

@Module({
    imports: [],
    controllers: [ProfileController],
    providers: [JwtTokenService, PrismaService, ProfileService, JwtGuard],
})
export class ProfileModule {}
