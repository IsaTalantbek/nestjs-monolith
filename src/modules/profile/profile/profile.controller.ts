import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
    MyAccountDTO,
    MyProfileDTO,
    SlugQueryDTO,
} from './sample/profile.dto.js'
import { MinData, UserProfileData } from './sample/profile.interface.js'
import { ProfileService } from './profile.service.js'
import { UUID } from 'crypto'
import { UDE, User } from '../../../common/decorators/user/user.decorator.js'
import {
    Route,
    SGM,
} from '../../../common/decorators/route/route.decorator.index.js'
import { Change } from '../../../common/decorators/change/change.js'

@Controller('profile')
@Route({
    guard: { only: SGM.authorized },
    log: { filename: 'profile', silent: false },
})
export class ProfileController {
    constructor(protected readonly service: ProfileService) {}

    @Get()
    @Change({ log: { filename: 'lom', silent: true } })
    protected async myProfile_BASE(
        @Res() reply: FastifyReply,
        @Query('slug') slugDTO: SlugQueryDTO,
        @User({ id: UDE.accountId }) accountId: UUID
    ) {
        const { slug } = slugDTO || {}
        const result: string | MyProfileDTO = await this.service.myProfile(
            accountId,
            slug
        )
        if (!(result instanceof MyProfileDTO)) {
            reply.status(400).send({
                message: result,
            })
            return result
        }
        reply.status(200).send(result)
        return result
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
