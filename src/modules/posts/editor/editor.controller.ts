import { Controller, UseGuards, Post, Body, Req, Res } from '@nestjs/common'
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard'
import { EditorService } from './editor.service'
import { EditorDto } from './editor.dto'

@Controller('editor')
@UseGuards(JwtGuard)
export class EditorController {
    constructor(private readonly editorService: EditorService) {}

    @Post()
    async createPost(
        @Body() editorDto: EditorDto,
        @Req() req: any,
        @Res() reply: any
    ) {
        try {
            const accountId = req.user.accountId
            let { type, tags, text, profileId, title } = editorDto
            const result = await this.editorService.createPost({
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
            console.error(`Editor-CreatePost: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка, при попытке публикации поста. Пожалуйста, сообщите нам подробности случившегося',
            })
        }
    }
}
