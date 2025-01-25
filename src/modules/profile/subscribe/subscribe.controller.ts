import { FastifyReply, FastifyRequest } from 'fastify'
import { UUID } from 'crypto'
import { SubscribeService } from './subscribe.service.js'
import { SubscribeController_BASE } from './subscribe.base.controller.js'

export class SubscribeController extends SubscribeController_BASE {
    constructor(private readonly subscribeService: SubscribeService) {
        super(subscribeService)
    }

    async giveSubscriptions(
        reply: FastifyReply,
        req: FastifyRequest,
        profileId?: UUID
    ) {
        const accountId = req.user.accountId
        const result = await this.service.giveSubscriptions(
            accountId,
            profileId
        )
        if (result === 'Неправильные данные') {
            return reply.status(400).send({ message: result })
        }
        return reply.status(200).send(result)
    }

    async giveSubscription(
        reply: FastifyReply,
        req: FastifyRequest,
        profileId: UUID
    ) {
        const accountId = req.user.accountId
        const result = await this.service.giveSubscription(accountId, profileId)
        return reply.status(200).send(result)
    }

    async subscribe(reply: FastifyReply, req: FastifyRequest, profileId: UUID) {
        const accountId: UUID = req.user.accountId
        const result = await this.service.subscribe(accountId, profileId)
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply.status(200).send({ message: 'Успешная подписка/отписка' })
    }
}
