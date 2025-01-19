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

@Controller('profile')
export abstract class ProfileControllerBase {
    @Get()
    @UseGuards(SessionGuard)
    protected async myProfileBase(
        @Query('profileId') profileIdDTO: ProfileIdQueryDTO,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            return this.myProfile(profileIdDTO, reply, req)
        } catch (error) {
            errorStatic(error, reply, 'MY-PROFILE', 'загрузки своего профиля')
            return
        }
    }
    @Get('account')
    @UseGuards(SessionGuard)
    protected async myAccountBase(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            return this.myAccount(reply, req)
        } catch (error) {
            errorStatic(error, reply, 'MY-ACCOUNT', 'загрузки своего аккаунта')
            return
        }
    }
    @Get(':login')
    @UseGuards(SessionCheck)
    protected async userProfileBase(
        @Param('login') login: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            return this.userProfile(login, reply, req)
        } catch (error) {
            errorStatic(error, reply, 'USER-PROFILE', 'загрузки профиля')
            return
        }
    }

    protected abstract myProfile(
        profileIdDTO: ProfileIdQueryDTO,
        reply,
        req
    ): void
    protected abstract myAccount(reply, req): void
    protected abstract userProfile(login, reply, req): void
}
