import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { CommentService } from './comment.service.js'
import { JwtGuard } from '../../../common/guards/jwt/jwt.guard.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { errorStatic } from '../../../core/util/error.static.js'
import { UpdateCommentDto, WriteCommentDto } from './comment.dto.js'

@Controller('feed/comment')
@UseGuards(JwtGuard)
export class CommentController {
    constructor(private readonly comment: CommentService) {}

    @Get()
    async giveComments(
        @Query('postId') postId: string,
        @Query('profileId') profileId: string,
        @Res() reply: FastifyReply
    ) {
        try {
            const result = await this.comment.giveComments(postId, profileId)
            if (!result) {
                return reply
                    .status(400)
                    .send({ message: 'Похоже вы не ввели никаких данных' })
            }
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(error, reply, 'GIVE-COMMENTS', 'получить коментарии')
            return
        }
    }
    @Post()
    async writeComment(
        @Body() writeCommentDto: WriteCommentDto,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user.accountId
            const { text, profileId, postId, commentId } = writeCommentDto
            const result = await this.comment.writeComment(
                profileId,
                text,
                postId,
                accountId,
                commentId
            )
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Вы успешно написали комментарий' })
        } catch (error) {
            errorStatic(error, reply, 'WRITE-COMMENT', 'написать комментарий')
            return
        }
    }
    @Put()
    async updateComment(
        @Body() updateCommentDto: UpdateCommentDto,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user.accountId
            const { text, commentId } = updateCommentDto
            const result = await this.comment.updateComment(
                commentId,
                accountId,
                text
            )
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Вы успешно обновили комментарий' })
        } catch (error) {
            errorStatic(error, reply, 'UPDATE-COMMENT', 'обновить комментарий')
            return
        }
    }
    @Delete(':commentId')
    async deleteComment(
        @Param('commentId') commentId: string,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user.accountId
            const result = await this.comment.deleteComment(
                commentId,
                accountId
            )
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Вы успешно удалили комментарий' })
        } catch (error) {
            errorStatic(error, reply, 'DELETE-COMMENT', 'удалить комментарий')
            return
        }
    }
}
