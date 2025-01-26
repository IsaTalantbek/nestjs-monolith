import { FastifyReply, FastifyRequest } from 'fastify'
import { ProfileService } from './profile.service.js'
import { ProfileController_BASE } from './profile.base.controller.js'
import {
    MyAccountDTO,
    MyProfileDTO,
    SlugQueryDTO,
} from './sample/profile.dto.js'
import { MinData, UserProfileData } from './sample/profile.interface.js'

export class ProfileController extends ProfileController_BASE {
    constructor(private readonly profileService: ProfileService) {
        super(profileService)
    }

    async myProfile(
        reply: FastifyReply,
        req: FastifyRequest,
        slugDTO: SlugQueryDTO
    ) {
        const { slug } = slugDTO || {}
        const accountId = req.user!.accountId
        const result: string | MyProfileDTO = await this.service.myProfile(
            accountId,
            slug
        )
        if (!(result instanceof MyProfileDTO)) {
            reply.status(400).send({
                message: result,
            })
            return result
        }
        reply.status(200).send(result)
        return result
    }

    async myAccount(reply: FastifyReply, req: FastifyRequest) {
        const accountId = req.user!.accountId
        const result: MyAccountDTO = await this.service.myAccount(accountId)
        reply.status(200).send(result)
        return result
    }

    async userProfile(reply: FastifyReply, req: FastifyRequest, slug: string) {
        const accountId = req.user?.accountId
        const result: MinData | UserProfileData | string =
            await this.service.userProfile(slug, accountId)
        if (typeof result === 'string') {
            reply.status(400).send({ message: result })
            return result
        }
        reply.status(200).send(result)
        return result
    }
}
