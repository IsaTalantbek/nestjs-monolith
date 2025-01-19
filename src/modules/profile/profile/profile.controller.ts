import {
    Controller,
    Get,
    Param,
    Query,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ProfileService } from './profile.service.js'
import { SessionGuard } from '../../../common/guards/session/session.guard.js'
import { SessionCheck } from '../../../common/guards/session/session.check.js'
import { ParamUuidPipe } from '../../../common/pipes/paramUUID.pipe.js'
import { errorStatic } from '../../../core/util/error.static.js'
import { ProfileIdQueryDTO } from './sample/profile.dto.js'
import { ProfileControllerBase } from './profile.base.controller.js'

@Controller('profile')
export class ProfileController extends ProfileControllerBase {
    constructor(private readonly profile: ProfileService) {
        super()
    }

    async myProfile(
        profileIdDTO: ProfileIdQueryDTO,
        reply: FastifyReply,
        req: FastifyRequest
    ) {
        const { profileId } = profileIdDTO || undefined
        const accountId = req.user.accountId
        const result = await this.profile.myProfile(accountId, profileId)
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

    async userProfile(login: string, reply: FastifyReply, req: FastifyRequest) {
        const accountId = req.user?.accountId
        const result = await this.profile.userProfile(login, accountId)
        return reply.status(200).send(result)
    }
}
