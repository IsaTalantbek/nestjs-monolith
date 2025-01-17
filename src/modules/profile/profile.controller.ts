import {
    Controller,
    Get,
    Param,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { ProfileService } from './profile.service.js'
import { SessionGuard } from '../../common/guards/session/session.guard.js'
import { SessionCheck } from '../../common/guards/session/session.check.js'
import { ParamUuidPipe } from '../../common/pipes/paramUUID.pipe.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { errorStatic } from '../../core/util/error.static.js'

@Controller('profile')
export class ProfileController {
    constructor(private readonly profile: ProfileService) {}
    @Get()
    @UseGuards(SessionGuard)
    async myProfile(@Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        try {
            const accountId = req.user.accountId
            const result = await this.profile.myProfile(accountId)
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(error, reply, 'MY-PROFILE', 'загрузки своего профиля')
            return
        }
    }

    @UseGuards(SessionCheck)
    @UsePipes(ParamUuidPipe)
    @Get(':profileId')
    async userProfile(
        @Param('profileId') profileId: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            const accountId = req.user?.accountId
            const result = await this.profile.userProfile(profileId, accountId)
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(error, reply, 'USER-PROFILE', 'загрузки профиля')
            return
        }
    }
}
