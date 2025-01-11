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
import { JwtCheck } from 'src/common/guards/jwt/jwt.check'
import { PostsService } from './posts.service'
import { GivePostQueryDto } from './posts.dto'
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard'
import { ParamUuidPipe } from 'src/common/pipes/paramUUID.pipe'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller('feed')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @UseGuards(JwtCheck)
    @Get()
    async givePosts(
        @Query() queryDto: GivePostQueryDto,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            const accountId = req.user?.accountId

            const { type, tags } = queryDto

            const checktags = []

            checktags.push(tags)

            let result

            if (tags) {
                result = await this.postsService.givePosts(
                    type,
                    accountId,
                    checktags
                )
            }

            if (!result || result.length === 0) {
                result = await this.postsService.givePosts(type, accountId)
                return reply.status(200).send(result)
            }

            return reply.status(200).send(result)
        } catch (error) {
            console.error(`Give-Posts: ${error}`)
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
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user.accountId
            const result = await this.postsService.likePost(postId, accountId)
            if (result !== true) {
                return reply.status(500).send({ message: result })
            }
            return reply.status(200).send({ message: 'Лайк успешно поставлен' })
        } catch (error) {
            console.error(`Like-Post: ${error}`)
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
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user.accountId
            const result = await this.postsService.dislikePost(
                postId,
                accountId
            )
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Дизлайк успешно поставлен' })
        } catch (error) {
            console.error(`Dislike-Post: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке поставить дизлайк. Пожалуйста, сообщите нам подробности',
            })
        }
    }
}
