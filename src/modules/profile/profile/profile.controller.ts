import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
    Req,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Route } from '@decorator/route'
import { IpAdressBlockService } from '@util/ip-block'
import { SGM } from '@guard/session'
import { UDE, User } from '@decorator/user'
import {
    MyAccountDTO,
    MyProfileDTO,
    SlugQueryDTO,
} from './sample/profile.dto.js'
import { MinData, UserProfileData } from './sample/profile.service.interface.js'
import { ProfileService } from './profile.service.js'
import { UUID } from 'crypto'

@Controller('profile')
@Route({
    session: { only: SGM.authorized },
    log: { filename: 'profile', silent: false, hide: false },
})
export class ProfileController {
    constructor(
        protected readonly service: ProfileService,
        protected readonly block: IpAdressBlockService
    ) {}
    @Get()
    protected async myProfile_BASE(
        @Req() req: FastifyRequest,
        @Query('slug') slugDTO: SlugQueryDTO,
        @User({ id: UDE.accountId }) accountId: UUID
    ) {
        try {
            const { slug } = slugDTO || {}
            const result: string | MyProfileDTO = await this.service.myProfile(
                accountId,
                slug
            )
            if (typeof result === 'string') {
                throw new BadRequestException(result)
            }
            return result
        } finally {
            this.block.unlock(req.ip)
        }
    }

    @Get('account')
    protected async myAccount_BASE(@Req() req: FastifyRequest) {
        const accountId = req.user!.accountId
        const result: MyAccountDTO = await this.service.myAccount(accountId)
        return result
    }

    @Get(':slug')
    protected async userProfile_BASE(
        @Req() req: FastifyRequest,
        @Param('slug') slug: string
    ) {
        const accountId = req.user?.accountId
        const result: MinData | UserProfileData | string =
            await this.service.userProfile(slug, accountId)
        if (typeof result === 'string') {
            throw new BadRequestException(result)
        }
        return result
    }
}
