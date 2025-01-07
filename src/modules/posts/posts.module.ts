import { Module } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { JwtAuthSettings } from 'src/core/keys/jwt/jwt.auth.settings'

@Module({
    imports: [],
    providers: [PostsService, PrismaService, JwtService, JwtAuthSettings],
    controllers: [PostsController],
})
export class PostsModule {}
