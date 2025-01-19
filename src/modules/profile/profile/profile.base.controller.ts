import {
    Controller,
    Get,
    Param,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SessionGuard } from '../../../common/guards/session/session.guard.js'
import { SessionCheck } from '../../../common/guards/session/session.check.js'
import { errorStatic } from '../../../core/util/error.static.js'
import { slugQueryDTO } from './sample/profile.dto.js'

@Controller('profile')
export abstract class ProfileController_BASE {
    @Get()
    @UseGuards(SessionGuard)
    protected async myProfile_BASE(
        @Query('slug') slugDTO: slugQueryDTO,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            return await this.myProfile(slugDTO, reply, req)
        } catch (error) {
            errorStatic(error, reply, 'MY-PROFILE', 'загрузки своего профиля')
            return
        }
    }
    @Get('account')
    @UseGuards(SessionGuard)
    protected async myAccount_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            return await this.myAccount(reply, req)
        } catch (error) {
            errorStatic(error, reply, 'MY-ACCOUNT', 'загрузки своего аккаунта')
            return
        }
    }
    @Get(':slug')
    @UseGuards(SessionCheck)
    protected async userProfile_BASE(
        @Param('slug') slug: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            return await this.userProfile(slug, reply, req)
        } catch (error) {
            errorStatic(error, reply, 'USER-PROFILE', 'загрузки профиля')
            return
        }
    }

    protected abstract myProfile(
        profileIdDTO: slugQueryDTO,
        reply: FastifyReply,
        req: FastifyRequest
    )
    protected abstract myAccount(reply: FastifyReply, req: FastifyRequest)
    protected abstract userProfile(
        slug: string,
        reply: FastifyReply,
        req: FastifyRequest
    )
}
