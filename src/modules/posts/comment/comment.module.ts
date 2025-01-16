import { Module } from '@nestjs/common'
import { CommentService } from './comment.service.js'
import { AuthPackModule } from '../../../auth.pack.module.js'
import { CommentController } from './comment.controller.js'

@Module({
    imports: [AuthPackModule],
    providers: [CommentService],
    controllers: [CommentController],
})
export class CommentModule {}
