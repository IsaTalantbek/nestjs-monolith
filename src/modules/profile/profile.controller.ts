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
import { JwtGuard } from '../../common/guards/jwt/jwt.guard.js'
import { JwtCheck } from '../../common/guards/jwt/jwt.check.js'
import { ParamUuidPipe } from '../../common/pipes/paramUUID.pipe.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { errorStatic } from '../../common/util/error.static.js'

@Controller('profile')
export class ProfileController {
    constructor(private readonly profile: ProfileService) {}
    @Get()
    @UseGuards(JwtGuard)
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

    @UseGuards(JwtCheck)
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
