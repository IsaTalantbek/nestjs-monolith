import { Controller, UseGuards, Post, Body, Req, Res } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { EditorDto } from './editor.dto.js'
import { EditorService } from './editor.service.js'

@Controller('editor')
export class EditorController {
    constructor(private readonly editor: EditorService) {}

    @Post()
    async createPost(
        @Body() editorDto: EditorDto,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
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
    }
}
