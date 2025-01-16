import {
    Controller,
    Get,
    Query,
    Req,
    UseGuards,
    Res,
    Param,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { GivePostQueryDto } from './posts.dto.js'
import { PostsService } from './posts.service.js'
import { JwtCheck } from '../../common/guards/jwt/jwt.check.js'
import { errorStatic } from '../../common/util/error.static.js'
import { PrismaService } from '../../core/database/prisma.service.js'

@Controller('feed')
export class PostsController {
    constructor(
        private readonly posts: PostsService,
        private readonly prisma: PrismaService
    ) {}

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
    @Get(':postId')
    async givePost(@Param('postId') postId: string) {
        return this.prisma.post.findUnique({
            where: { id: postId },
        })
    }
}
