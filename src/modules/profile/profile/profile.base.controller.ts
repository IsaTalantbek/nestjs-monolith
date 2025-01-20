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
import { SlugQueryDTO } from './sample/profile.dto.js'

@Controller('profile')
export abstract class ProfileController_BASE {
    @Get()
    @UseGuards(SessionGuard)
    protected async myProfile_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Query('slug') slugDTO: SlugQueryDTO
    ) {
        try {
            return await this.myProfile(reply, req, slugDTO)
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
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('slug') slug: string
    ) {
        try {
            return await this.userProfile(reply, req, slug)
        } catch (error) {
            errorStatic(error, reply, 'USER-PROFILE', 'загрузки профиля')
            return
        }
    }

    protected abstract myProfile(
        reply: FastifyReply,
        req: FastifyRequest,
        slugDTO: SlugQueryDTO
    )
    protected abstract myAccount(reply: FastifyReply, req: FastifyRequest)
    protected abstract userProfile(
        reply: FastifyReply,
        req: FastifyRequest,
        slug: string
    )
}
