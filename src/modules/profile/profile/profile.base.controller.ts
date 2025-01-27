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
import {
    MyAccountDTO,
    MyProfileDTO,
    SlugQueryDTO,
} from './sample/profile.dto.js'
import { Log } from '../../../common/decorators/logger.decorator.js'
import { MinData, UserProfileData } from './sample/profile.interface.js'
import { ProfileService } from './profile.service.js'
import { Guard } from '../../../common/decorators/guard.decorator.js'
import { SGM } from '../../../common/guards/session/session.guard.enum.js'
import { RGM } from '../../../common/guards/role/role.guard.enum.js'
import { RoleGuard } from '../../../common/guards/role/role.guard.js'

@Log('profile')
@Guard(SGM.authorized)
@Controller('profile')
export abstract class ProfileController_BASE {
    constructor(protected readonly service: ProfileService) {}
    @Guard(SGM.authorized)
    @Get()
    protected async myProfile_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Query('slug') slugDTO: SlugQueryDTO
    ) {
        return await this.myProfile(reply, req, slugDTO)
    }
    @Guard(SGM.authorized, RGM.support)
    @UseGuards(RoleGuard)
    @Get('account')
    protected async myAccount_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        return await this.myAccount(reply, req)
    }
    @Guard(SGM.check)
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
