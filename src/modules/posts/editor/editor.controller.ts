import { Controller, UseGuards, Post, Body, Req, Res } from '@nestjs/common'
import { JwtGuard } from 'src/common/guards/jwt.guard'
import { EditorService } from './editor.service'
import { EditorDto } from './editor.Dto'
import { errorStatic } from 'src/util/error.static'

@Controller('feed/editor')
@UseGuards(JwtGuard)
export class EditorCoontroller {
    constructor(private readonly editorService: EditorService) {}

    @Post()
    async createPost(
        @Body() editorDto: EditorDto,
        @Req() req: any,
        @Res() reply: any
    ) {
        try {
            const userId = req.user.userId
            let { type, tags, text, profileId } = editorDto
            const result = await this.editorService.createPost(
                type,
                tags,
                userId,
                text,
                profileId
            )
            if (!result) {
                reply
                    .status(400)
                    .send({ message: 'Похоже, что-то пошло не так' })
            }
            reply.status(200).send(result)
        } catch (error) {
            return errorStatic(error, reply)
        }
    }
}
