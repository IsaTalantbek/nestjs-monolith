import {
    Controller,
    Req,
    UseGuards,
    Res,
    Param,
    Put,
    UsePipes,
    Get,
    Delete,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { StatsService } from './stats.service.js'
import { ParamUuidPipe } from '../../../common/pipes/paramUUID.pipe.js'

@Controller('feed/stats')
export class StatsController {
    constructor(private readonly stats: StatsService) {}

    @UsePipes(ParamUuidPipe)
    @Put(':postId/like')
    async likePost(
        @Param('postId') postId: string,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const accountId = req.user.accountId
        const result = await this.stats.likePost(postId, accountId)
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply.status(200).send({ message: 'Лайк успешно поставлен' })
    }

    @UsePipes(ParamUuidPipe)
    @Put(':postId/dislike')
    async dislikePost(
        @Param('postId') postId: string,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const accountId = req.user.accountId
        const result = await this.stats.dislikePost(postId, accountId)
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply.status(200).send({ message: 'Дизлайк успешно поставлен' })
    }
    @UsePipes(ParamUuidPipe)
    @Delete(':postId')
    async deleteStats(
        @Param('postId') postId: string,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const accountId = req.user.accountId
        const result = await this.stats.deleteStats(postId, accountId)
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply.status(200).send({ message: 'Реакция успешно убрана' })
    }
    @UsePipes(ParamUuidPipe)
    @Get()
    async giveStats(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const accountId = req.user.accountId
        const result = await this.stats.giveStats(accountId)
        return reply.status(200).send(result)
    }
}
