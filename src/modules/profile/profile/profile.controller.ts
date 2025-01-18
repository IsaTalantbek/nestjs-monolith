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
import { MyProfileDTO, ProfileIdQueryDTO } from './profile.dto.js'

@Controller('profile')
export class ProfileController {
    constructor(private readonly profile: ProfileService) {}
    @Get()
    @UseGuards(SessionGuard)
    async myProfile(
        @Query('profileId') profileIdDTO: ProfileIdQueryDTO,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            const { profileId } = profileIdDTO || undefined
            const accountId = req.user.accountId
            const result = await this.profile.myProfile(accountId, profileId)
            if (typeof result === 'string') {
                return reply.status(400).send({
                    message: result,
                })
            }
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(error, reply, 'MY-PROFILE', 'загрузки своего профиля')
            return
        }
    }
    @Get('account')
    @UseGuards(SessionGuard)
    async myAccount(@Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        try {
            const accountId = req.user.accountId
            const result = await this.profile.myAccount(accountId)
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(error, reply, 'MY-ACCOUNT', 'загрузки своего аккаунта')
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
