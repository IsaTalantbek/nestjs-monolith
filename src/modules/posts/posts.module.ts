import { Module } from '@nestjs/common'
import { PostsService } from './posts.service.js'
import { PostsController } from './posts.controller.js'
import { PrismaModule } from '../../core/database/prisma.module.js'
import { JwtAuthModule } from '../../core/keys/jwt/jwt.auth.module.js'

@Module({
    imports: [PrismaModule],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
