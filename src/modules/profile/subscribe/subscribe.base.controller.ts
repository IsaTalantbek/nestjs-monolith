import {
    Controller,
    Get,
    Param,
    Put,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { UUID } from 'crypto'
import { SessionGuard } from '../../../common/guards/session/session.guard.js'
import { ParamUuidPipe } from '../../../common/pipes/paramUUID.pipe.js'
import { errorStatic } from '../../../core/util/error.static.js'

@Controller('profile/subscribe')
export abstract class SubscribeController_BASE {
    @UseGuards(SessionGuard)
    @Get(':profileId?')
    protected async giveSubscribtions_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('profileId') profileId: UUID
    ) {
        try {
            return await this.giveSubscriptions(reply, req, profileId)
        } catch (error) {
            errorStatic(error, reply, 'GIVE-SUBSCRIPTIONS', 'получить подписки')
            return
        }
    }
    @UseGuards(SessionGuard)
    @UsePipes(ParamUuidPipe)
    @Get('check/:profileId')
    protected async giveSubscription_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('profileId') profileId: UUID
    ) {
        try {
            return await this.giveSubscription(reply, req, profileId)
        } catch (error) {
            errorStatic(error, reply, 'GIVE-SUBSCRIPTION', 'получить подписку')
            return
        }
    }
    @UseGuards(SessionGuard)
    @UsePipes(ParamUuidPipe)
    @Put(':profileId')
    protected async subscribe_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('profileId') profileId: UUID
    ) {
        try {
            return await this.subscribe(reply, req, profileId)
        } catch (error) {
            errorStatic(error, reply, 'SUBSCRIBE', 'подписаться на профиль')
            return
        }
    }
    protected abstract giveSubscriptions(
        reply: FastifyReply,
        req: FastifyRequest,
        profileId?: UUID
    )
    protected abstract giveSubscription(
        reply: FastifyReply,
        req: FastifyRequest,
        profileId: UUID
    )
    protected abstract subscribe(
        reply: FastifyReply,
        req: FastifyRequest,
        profileId: UUID
    )
}
