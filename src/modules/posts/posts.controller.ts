import {
    Controller,
    Get,
    Query,
    Req,
    UseGuards,
    Res,
    Param,
    Put,
    UsePipes,
} from '@nestjs/common'
import { JwtCheck } from 'src/common/guards/jwt.check'
import { PostsService } from './posts.service'
import { GivePostQueryDto, PostIdDto } from './posts.dto'
import { JwtGuard } from 'src/common/guards/jwt.guard'
import { ParamUuidPipe } from 'src/common/pipes/paramUUID.pipe'

@Controller('feed')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @UseGuards(JwtCheck)
    @Get()
    async givePosts(
        @Query() queryDto: GivePostQueryDto,
        @Res() reply: any,
        @Req() req: any
    ) {
        try {
            const userId = req.user?.userId

            const { type, tags } = queryDto

            const checktags = []

            checktags.push(tags)

            let result

            if (tags) {
                result = await this.postsService.givePosts(
                    type,
                    userId,
                    checktags
                )
            }

            if (!result || result.length === 0) {
                result = await this.postsService.givePosts(type, userId)
                return reply.status(200).send(result)
            }

            return reply.status(200).send(result)
        } catch (error) {
            console.error(`Give-Posts-Error: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникли ошибки при попытке получения контента. Пожалуйста, сообщите нам подробности случившегося',
            })
        }
    }
    @UseGuards(JwtGuard)
    @UsePipes(ParamUuidPipe)
    @Put(':postId/like')
    async likePost(
        @Param('postId') postId: string,
        @Req() req: any,
        @Res() reply: any
    ) {
        try {
            const userId = req.user.userId
            const result = await this.postsService.likePost(postId, userId)
            if (result !== true) {
                return reply.status(500).send({ message: result })
            }
            return reply.status(200).send({ message: 'Лайк успешно поставлен' })
        } catch (error) {
            console.error(`Like-Post-Error: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке поставить лайк. Пожалуйста, сообщите нам подробности',
            })
        }
    }
    @UseGuards(JwtGuard)
    @UsePipes(ParamUuidPipe)
    @Put(':postId/dislike')
    async dislikePost(
        @Param('postId') postId: string,
        @Req() req: any,
        @Res() reply: any
    ) {
        try {
            const userId = req.user.userId
            const result = await this.postsService.dislikePost(postId, userId)
            if (result !== true) {
                return reply.status(500).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Дизлайк успешно поставлен' })
        } catch (error) {
            console.error(`Dislike-Post-Error: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке поставить дизлайк. Пожалуйста, сообщите нам подробности',
            })
        }
    }
}
