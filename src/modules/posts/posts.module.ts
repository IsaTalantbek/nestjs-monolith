import { Module } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { JwtTokenService } from 'src/core/keys/jwt.service'

@Module({
    imports: [],
    providers: [PostsService, PrismaService, JwtTokenService],
    controllers: [PostsController],
})
export class PostsModule {}
