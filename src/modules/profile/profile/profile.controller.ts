import { Controller } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ProfileService } from './profile.service.js'
import { ProfileController_BASE } from './profile.base.controller.js'
import {
    MyAccountDTO,
    MyProfileDTO,
    SlugQueryDTO,
} from './sample/profile.dto.js'
import { MinData, UserProfileData } from './sample/profile.interface.js'

@Controller('profile')
export class ProfileController extends ProfileController_BASE {
    constructor(private readonly profile: ProfileService) {
        super()
    }

    async myProfile(
        reply: FastifyReply,
        req: FastifyRequest,
        slugDTO: SlugQueryDTO
    ) {
        const { slug } = slugDTO || {}
        const accountId = req.user.accountId
        const result: string | MyProfileDTO = await this.profile.myProfile(
            accountId,
            slug
        )
        if (!(result instanceof MyProfileDTO)) {
            return reply.status(400).send({
                message: result,
            })
        }
        return reply.status(200).send(result)
    }

    async myAccount(reply: FastifyReply, req: FastifyRequest) {
        const accountId = req.user.accountId
        const result: MyAccountDTO = await this.profile.myAccount(accountId)
        return reply.status(200).send(result)
    }

    async userProfile(reply: FastifyReply, req: FastifyRequest, slug: string) {
        const accountId = req.user?.accountId
        const result: MinData | UserProfileData | string =
            await this.profile.userProfile(slug, accountId)
        if (typeof result === 'string') {
            return reply.status(400).send({ message: result })
        }
        return reply.status(200).send(result)
    }
}
