import { Controller } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ProfileService } from './profile.service.js'
import { ProfileController_BASE } from './profile.base.controller.js'
import { slugQueryDTO } from './sample/profile.dto.js'

@Controller('profile')
export class ProfileController extends ProfileController_BASE {
    constructor(private readonly profile: ProfileService) {
        super()
    }

    async myProfile(
        slugDto: slugQueryDTO,
        reply: FastifyReply,
        req: FastifyRequest
    ) {
        const { slug } = slugDto || {}
        const accountId = req.user.accountId
        const result = await this.profile.myProfile(accountId, slug)
        if (typeof result === 'string') {
            return reply.status(400).send({
                message: result,
            })
        }
        return reply.status(200).send(result)
    }

    async myAccount(reply: FastifyReply, req: FastifyRequest) {
        const accountId = req.user.accountId
        const result = await this.profile.myAccount(accountId)
        return reply.status(200).send(result)
    }

    async userProfile(slug: string, reply: FastifyReply, req: FastifyRequest) {
        const accountId = req.user?.accountId
        const result = await this.profile.userProfile(slug, accountId)
        return reply.status(200).send(result)
    }
}
