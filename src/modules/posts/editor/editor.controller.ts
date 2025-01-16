import { Controller, UseGuards, Post, Body, Req, Res } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { EditorDto } from './editor.dto.js'
import { EditorService } from './editor.service.js'
import { JwtGuard } from '../../../common/guards/jwt/jwt.guard.js'
import { errorStatic } from '../../../core/util/error.static.js'

@Controller('editor')
@UseGuards(JwtGuard)
export class EditorController {
    constructor(private readonly editor: EditorService) {}

    @Post()
    async createPost(
        @Body() editorDto: EditorDto,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user.accountId
            let { type, tags, text, profileId, title } = editorDto
            const result = await this.editor.createPost({
                type,
                tags,
                accountId,
                profileId,
                text,
                title,
            })
            if (!result) {
                reply.status(400).send({
                    message: 'Профиля, который создает пост не существует',
                })
            }
            reply.status(200).send(result)
        } catch (error) {
            errorStatic(error, reply, 'CREATE-POST-EDITOR', 'создания поста')
            return
        }
    }
}
