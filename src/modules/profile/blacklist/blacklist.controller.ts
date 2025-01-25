import { FastifyReply, FastifyRequest } from 'fastify'
import { BlacklistService } from './blacklist.service.js'
import { BlackListController_BASE } from './blacklist.base.controller.js'
import { UUID } from 'crypto'
import { GiveBlacklistDTO } from './sample/blacklist.dto.js'

export class BlackListController extends BlackListController_BASE {
    constructor(private readonly blacklistService: BlacklistService) {
        super(blacklistService)
    }

    async giveBlacklist(
        reply: FastifyReply,
        req: FastifyRequest
    ): Promise<GiveBlacklistDTO[]> {
        const accountId: UUID = req.user!.accountId
        const result: GiveBlacklistDTO[] =
            await this.service.giveBlacklist(accountId)
        reply.status(200).send(result)
        return result
    }

    async addToBlacklist(
        reply: FastifyReply,
        req: FastifyRequest,
        vsPid: UUID
    ): Promise<string> {
        const accountId: UUID = req.user!.accountId
        const result: true | string = await this.service.addToBlacklist(
            accountId,
            vsPid
        )
        if (result !== true) {
            reply.status(400).send({ message: result })
            return result
        }
        const message: string = 'Пользователь успешно добавлен в черный список'
        reply.status(200).send({
            message: message,
        })
        return message
    }

    async deleteToBlacklist(
        reply: FastifyReply,
        req: FastifyRequest,
        vsPid: UUID
    ): Promise<string> {
        const accountId: UUID = req.user!.accountId
        const result: true | string = await this.service.deleteToBlacklist(
            accountId,
            vsPid
        )
        if (result !== true) {
            reply.status(400).send({ message: result })
            return result
        }
        const message = 'Пользователь успешно удален из черного списка'
        reply.status(200).send({
            message: message,
        })
        return message
    }

    async deleteAllToBlacklist(
        reply: FastifyReply,
        req: FastifyRequest
    ): Promise<string> {
        const accountId: UUID = req.user!.accountId
        const result: true | string =
            await this.service.deleteAllToBlacklist(accountId)
        if (result !== true) {
            reply.status(400).send({ message: result })
            return result
        }
        const message: string = 'Пользователи успешно удалены из черного списка'
        reply.status(200).send({
            message: message,
        })
        return message
    }
}
