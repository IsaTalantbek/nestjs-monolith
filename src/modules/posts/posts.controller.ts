import { Controller, Get, Query, Req, Res, Param } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { GivePostQueryDto } from './posts.dto.js'
import { PostsService } from './posts.service.js'
import { PrismaService } from '../../core/database/prisma.service.js'

@Controller('feed')
export class PostsController {
    constructor(
        private readonly posts: PostsService,
        private readonly prisma: PrismaService
    ) {}

    @Get()
    async givePosts(
        @Query() queryDto: GivePostQueryDto,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
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
    }
    @Get(':postId')
    async givePost(@Param('postId') postId: string) {
        return this.prisma.post.findUnique({
            where: { id: postId },
        })
    }
}
