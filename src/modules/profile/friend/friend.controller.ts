import { FriendService } from './friend.service.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FriendController_BASE } from './friend.base.controller.js'
import { UUID } from 'crypto'
import { ActiveWaitingFriendDTO } from './sample/friend.dto.js'

export class FriendController extends FriendController_BASE {
    constructor(private readonly friend: FriendService) {
        super()
    }

    async giveFriends(
        reply: FastifyReply,
        req: FastifyRequest,
        optionDTO: ActiveWaitingFriendDTO
    ) {
        const { option } = optionDTO
        const accountId = req.user.accountId
        const result = await this.friend.giveFriends(accountId, option)
        reply.status(200).send(result)
        return result
    }

    async addFriend(reply: FastifyReply, req: FastifyRequest, vsAid: UUID) {
        const accountId = req.user.accountId
        const result = await this.friend.addFriend(accountId, vsAid)
        if (result !== true) {
            reply.status(400).send({ message: result })
            return result
        }
        const message = 'Успешно отправлен запрос на дружбу'
        reply.status(200).send({ message: message })
        return message
    }

    async acceptFriend(
        reply: FastifyReply,
        req: FastifyRequest,
        friendId: UUID
    ) {
        const accountId = req.user.accountId
        const result = await this.friend.acceptFriend(accountId, friendId)
        if (result !== true) {
            reply.status(400).send({ message: result })
            return result
        }
        const message = 'Успешно принят запрос на дружбу'
        reply.status(200).send({ message: message })
        return message
    }

    async deleteFriend(reply: FastifyReply, req: FastifyRequest, vsAid: UUID) {
        const accountId = req.user.accountId
        const result = await this.friend.deleteFriend(accountId, vsAid)
        if (result !== true) {
            reply.status(400).send({ message: result })
            return result
        }
        const message = 'Пользователь успешно удален из друзей'
        reply.status(200).send({ message: message })
        return message
    }
}
