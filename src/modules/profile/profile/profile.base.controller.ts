import {
    Controller,
    Get,
    Param,
    Query,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SessionGuard } from '../../../common/guards/session/session.guard.js'
import { SessionCheck } from '../../../common/guards/session/session.check.js'
import { SlugQueryDTO } from './sample/profile.dto.js'
import { Log } from '../../../common/decorators/logger.decorator.js'

@Log('profile')
@Controller('profile')
export abstract class ProfileController_BASE {
    @Get()
    @UseGuards(SessionGuard)
    protected async myProfile_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Query('slug') slugDTO: SlugQueryDTO
    ) {
        throw new Error('helo')
        return await this.myProfile(reply, req, slugDTO)
    }
    @Get('account')
    @UseGuards(SessionGuard)
    protected async myAccount_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        return await this.myAccount(reply, req)
    }
    @Get(':slug')
    @UseGuards(SessionCheck)
    protected async userProfile_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('slug') slug: string
    ) {
        return await this.userProfile(reply, req, slug)
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
