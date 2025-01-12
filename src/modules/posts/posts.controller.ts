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
import { FastifyReply, FastifyRequest } from 'fastify'
import { GivePostQueryDto } from './posts.dto.js'
import { PostsService } from './posts.service.js'
import { JwtCheck } from '../../common/guards/jwt/jwt.check.js'
import { JwtGuard } from '../../common/guards/jwt/jwt.guard.js'
import { ParamUuidPipe } from '../../common/pipes/paramUUID.pipe.js'
import { errorStatic } from '../../common/util/error.static.js'

@Controller('feed')
export class PostsController {
    constructor(private readonly posts: PostsService) {}

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
                result = await this.posts.givePosts(type, accountId, checktags)
            }

            if (!result || result.length === 0) {
                result = await this.posts.givePosts(type, accountId)
                return reply.status(200).send(result)
            }

            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(error, reply, 'GIVE-POSTS', 'загрузки постов')
            return
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
            const result = await this.posts.likePost(postId, accountId)
            if (result !== true) {
                return reply.status(500).send({ message: result })
            }
            return reply.status(200).send({ message: 'Лайк успешно поставлен' })
        } catch (error) {
            errorStatic(error, reply, 'LIKE-POSTS', 'лайкнуть пост')
            return
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
            const result = await this.posts.dislikePost(postId, accountId)
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Дизлайк успешно поставлен' })
        } catch (error) {
            errorStatic(error, reply, 'DISLIKE-POSTS', 'дизлайкнуть пост')
        }
    }
}
