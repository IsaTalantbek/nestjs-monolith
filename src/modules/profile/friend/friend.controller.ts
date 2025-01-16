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
import { JwtGuard } from '../../../common/guards/jwt/jwt.guard.js'
import { ParamUuidPipe } from '../../../common/pipes/paramUUID.pipe.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { errorStatic } from '../../../core/util/error.static.js'

@UseGuards(JwtGuard)
@Controller('profile/friends')
export class FriendController {
    constructor(private readonly friend: FriendService) {}

    @Get()
    async giveActiveFriends(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user.accountId
            const result = await this.friend.giveActiveFriends(accountId)
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(
                error,
                reply,
                'GIVE-ACTIVE-FRIENDS',
                'получить список друзей'
            )
            return
        }
    }
    @Get('waiting')
    async giveWaitingFriends(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user.accountId
            const result = await this.friend.giveWaitingFriends(accountId)
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(
                error,
                reply,
                'GIVE-WAITING-FRIENDS',
                'получить список ожидающих друзей'
            )
            return
        }
    }
    @UsePipes(ParamUuidPipe)
    @Post(':vsAid')
    async addFriend(
        @Param('vsAid') vsAid: string,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
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
        } catch (error) {
            errorStatic(
                error,
                reply,
                'ADD-FRIEND',
                'отправить запрос на дружбу'
            )
            return
        }
    }
    @UsePipes(ParamUuidPipe)
    @Put(':friendId')
    async acceptFriend(
        @Param('friendId') friendId: string,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user.accountId
            const result = await this.friend.acceptFriend(accountId, friendId)
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Успешно принят запрос на дружбу' })
        } catch (error) {
            errorStatic(
                error,
                reply,
                'ACCEPT-FRIEND',
                'принять запрос на дружбу'
            )
            return
        }
    }
    @UsePipes(ParamUuidPipe)
    @Delete('vsAid')
    async deleteFriend(
        @Param('friendId') vsAid: string,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
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
        } catch (error) {
            errorStatic(
                error,
                reply,
                'DELETE-FRIEND',
                'удалить друга из списка'
            )
            return
        }
    }
}
