import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
    Req,
    Res,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
    MyAccountDTO,
    MyProfileDTO,
    SlugQueryDTO,
} from './sample/profile.dto.js'
import { UUID } from 'crypto'
import { MinData, UserProfileData } from './sample/profile.interface.js'
import { ProfileService } from './profile.service.js'
import { SGM } from '@session-guard'
import { UDE, User } from '@user-decorator'
import { Route } from '@route-decorator'
import { IpAdressBlockService } from '@util-ip-block'

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
            throw new Error('hello')
            return result
        } finally {
            this.block.unlock(req.ip)
        }
    }

    @Get('account')
    protected async myAccount_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        const accountId = req.user!.accountId
        const result: MyAccountDTO = await this.service.myAccount(accountId)
        reply.status(200).send(result)
        return result
    }

    @Get(':slug')
    protected async userProfile_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('slug') slug: string
    ) {
        const accountId = req.user?.accountId
        const result: MinData | UserProfileData | string =
            await this.service.userProfile(slug, accountId)
        if (typeof result === 'string') {
            reply.status(400).send({ message: result })
            return result
        }
        reply.status(200).send(result)
        return result
    }
}
