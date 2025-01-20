import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { FriendService } from './friend.service.js'
import { SessionGuard } from '../../../common/guards/session/session.guard.js'
import { ParamUuidPipe } from '../../../common/pipes/paramUUID.pipe.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Log } from '../../../common/log/log.js'

@Controller('profile/friends')
@UseGuards(SessionGuard)
@Log('errors')
export class FriendController {
    constructor(private readonly friend: FriendService) {}

    @Get()
    async giveActiveFriends(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const accountId = req.user.accountId
        const result = await this.friend.giveActiveFriends(accountId)
        return reply.status(200).send(result)
    }
    @Get('waiting')
    async giveWaitingFriends(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const accountId = req.user.accountId
        const result = await this.friend.giveWaitingFriends(accountId)
        return reply.status(200).send(result)
    }
    @UsePipes(ParamUuidPipe)
    @Post(':vsAid')
    async addFriend(
        @Param('vsAid') vsAid: string,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const accountId = req.user.accountId
        const result = await this.friend.addFriend({
            accountId,
            vsAid,
        })
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply
            .status(200)
            .send({ message: 'Успешно отправлен запрос на дружбу' })
    }
    @UsePipes(ParamUuidPipe)
    @Put(':friendId')
    async acceptFriend(
        @Param('friendId') friendId: string,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const accountId = req.user.accountId
        const result = await this.friend.acceptFriend(accountId, friendId)
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply
            .status(200)
            .send({ message: 'Успешно принят запрос на дружбу' })
    }
    @UsePipes(ParamUuidPipe)
    @Delete('vsAid')
    async deleteFriend(
        @Param('friendId') vsAid: string,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const accountId = req.user.accountId
        const result = await this.friend.deleteFriend({
            accountId,
            vsAid,
        })
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply
            .status(200)
            .send({ message: 'Пользователь успешно удален из друзей' })
    }
}
