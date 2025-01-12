import { Module } from '@nestjs/common'
import { PostsService } from './posts.service.js'
import { PostsController } from './posts.controller.js'
import { AuthPackModule } from '../../auth.pack.module.js'

@Module({
    imports: [AuthPackModule],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
