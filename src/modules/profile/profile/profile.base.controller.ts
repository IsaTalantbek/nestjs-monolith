import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
    MyAccountDTO,
    MyProfileDTO,
    SlugQueryDTO,
} from './sample/profile.dto.js'
import { Log } from '../../../common/decorators/logger.decorator.js'
import { MinData, UserProfileData } from './sample/profile.interface.js'
import { ProfileService } from './profile.service.js'
import { Guard } from '../../../common/decorators/guard.decorator.js'

@Log('profile')
@Guard('un')
@Controller('profile')
export abstract class ProfileController_BASE {
    constructor(protected readonly service: ProfileService) {}

    @Get()
    protected async myProfile_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Query('slug') slugDTO: SlugQueryDTO
    ) {
        return await this.myProfile(reply, req, slugDTO)
    }
    @Guard('ch')
    @Get('account')
    protected async myAccount_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        console.log(req.user)
        return await this.myAccount(reply, req)
    }
    @Guard('au')
    @Get(':slug')
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
    ): Promise<MyProfileDTO | string>
    protected abstract myAccount(
        reply: FastifyReply,
        req: FastifyRequest
    ): Promise<MyAccountDTO | string>
    protected abstract userProfile(
        reply: FastifyReply,
        req: FastifyRequest,
        slug: string
    ): Promise<UserProfileData | MinData | string>
}
