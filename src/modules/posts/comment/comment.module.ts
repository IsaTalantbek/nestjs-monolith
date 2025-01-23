import { Module } from '@nestjs/common'
import { CommentService } from './comment.service.js'
import { CommentController } from './comment.controller.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'

@Module({
    imports: [PrismaModule],
    providers: [CommentService],
    controllers: [CommentController],
})
export class CommentModule {}
