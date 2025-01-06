import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { FriendService } from './friend.service'
import { JwtGuard } from 'src/common/guards/jwt.guard'
import { ParamUuidPipe } from 'src/common/pipes/paramUUID.pipe'

@UseGuards(JwtGuard)
@Controller('profile/friends')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    @Get()
    async giveActiveFriends(@Req() req: any, @Res() reply: any) {
        try {
            const userId = req.user.userId
            const result = await this.friendService.giveActiveFriends(userId)
            return reply.status(200).send(result)
        } catch (error) {
            console.error(`Give-Active-Friends: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке получить активных друзей. Пожалуйста, сообщите нам подробности',
            })
        }
    }
    @Get('waiting')
    async giveWaitingFriends(@Req() req: any, @Res() reply: any) {
        try {
            const userId = req.user.userId
            const result = await this.friendService.giveWaitingFriends(userId)
            return reply.status(200).send(result)
        } catch (error) {
            console.error(`Give-Active-Friends: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке получить ожидающих друзей. Пожалуйста, сообщите нам подробности',
            })
        }
    }
    @UsePipes(ParamUuidPipe)
    @Post(':vsUserId')
    async addFriend(
        @Param('vsProfileId') vsUserId: string,
        @Req() req: any,
        @Res() reply: any
    ) {
        try {
            const userId = req.user.userId
            const result = await this.friendService.addFriend(userId, vsUserId)
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Успешно отправлен запрос на дружбу' })
        } catch (error) {
            console.error(`Add-Friend: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке отправить запрос на дружбу. Пожалуйста, сообщите нам подробности',
            })
        }
    }
    @UsePipes(ParamUuidPipe)
    @Put('friendId')
    async acceptFriend(
        @Param('friendId') friendId: string,
        @Req() req: any,
        @Res() reply: any
    ) {
        try {
            const userId = req.user.userId
            const result = await this.friendService.acceptFriend(
                userId,
                friendId
            )
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Успешно принят запрос на дружбу' })
        } catch (error) {
            console.error(`Accept-Friend: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке принять запрос на дружбу. Пожалуйста, сообщите нам подробности',
            })
        }
    }
    @UsePipes(ParamUuidPipe)
    @Delete('friendId')
    async deleteFriend(
        @Param('friendId') friendId: string,
        @Req() req: any,
        @Res() reply: any
    ) {
        try {
            const userId = req.user.userId
            const result = await this.friendService.deleteFriend(
                userId,
                friendId
            )
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Пользователь успешно удален из друзей' })
        } catch (error) {
            console.error(`Delete-Friend: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке удалить пользователя из друзей, сообщите нам подробности',
            })
        }
    }
}
