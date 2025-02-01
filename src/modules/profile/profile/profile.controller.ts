import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
    MyAccountDTO,
    MyProfileDTO,
    SlugQueryDTO,
} from './sample/profile.dto.js'
import { MinData, UserProfileData } from './sample/profile.interface.js'
import { ProfileService } from './profile.service.js'
import { Use } from '@use-decorator'
import { SESSION_GUARD_CONSTANT, SessionGuard, SGM } from '@session-guard'
import { IpAdressGuard } from '@ip-block-guard'
import { UseLoggerInterceptor } from '@log-interceptor'
import { UDE, User } from '@user-decorator'
import { UUID } from 'crypto'
import { Change } from '@change-decorator'
import { Route } from '@route-decorator'
import { IpAdressBlockService } from '@util-ip-block'

@Controller('profile')
export class ProfileController {
    constructor(
        protected readonly service: ProfileService,
        protected readonly block: IpAdressBlockService
    ) {}
    @Get()
    @Use({
        guards: [
            IpAdressGuard,
            {
                use: SessionGuard,
                key: SESSION_GUARD_CONSTANT,
                metadata: SGM.authorized,
            },
        ],
        interceptors: [
            UseLoggerInterceptor({
                filename: 'profile',
                silent: false,
                hide: false,
            }),
        ],
    })
    protected async myProfile_BASE(
        @Res() reply: FastifyReply,
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
            if (!(result instanceof MyProfileDTO)) {
                reply.status(400).send({
                    message: result,
                })
                return result
            }
            reply.status(200).send(result)
            return result
        } finally {
            this.block.unlock(req.ip)
        }
    }

    @Get('account')
    @Route({ guard: { only: SGM.authorized } })
    @Change({ guard: { only: SGM.unauthorized } })
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
