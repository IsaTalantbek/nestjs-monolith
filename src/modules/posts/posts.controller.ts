import { Controller, Get, Query, Req, UseGuards, Res } from '@nestjs/common'
import { JwtCheck } from 'src/common/guards/jwt.check'
import { PostsService } from './posts.service'
import { QueryDto } from './posts.dto'
import { errorStatic } from 'src/common/util/error.static'

@Controller('feed')
@UseGuards(JwtCheck)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async givePosts(
        @Query() queryDto: QueryDto,
        @Res() reply: any,
        @Req() req: any
    ) {
        try {
            const userId = req.user.userId

            const { type, tags } = queryDto
            const checktags = []
            checktags.push(tags)
            const result = await this.postsService.givePosts(
                type,
                userId,
                checktags
            )
            if (result === false) {
                return reply.status(400).send({ message: 'Неправильный тип' })
            }
            if (result.length === 0) {
                const result2 = await this.postsService.givePosts(type, userId)
                return reply.status(200).send(result2)
            }
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(error, reply)
            return
        }
    }
}
