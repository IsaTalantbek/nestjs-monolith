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
import { ParamUuidPipe } from '../../../common/pipes/paramUUID.pipe.js'
import { SubscribeService } from './subscribe.service.js'

@Controller('profile/subscribe')
export abstract class SubscribeController_BASE {
    constructor(protected readonly service: SubscribeService) {}

    @Get(':profileId?')
    protected async giveSubscribtions_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('profileId') profileId: UUID
    ) {
        return await this.giveSubscriptions(reply, req, profileId)
    }

    @UsePipes(ParamUuidPipe)
    @Get('check/:profileId')
    protected async giveSubscription_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('profileId') profileId: UUID
    ) {
        return await this.giveSubscription(reply, req, profileId)
    }

    @UsePipes(ParamUuidPipe)
    @Put(':profileId')
    protected async subscribe_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('profileId') profileId: UUID
    ) {
        return await this.subscribe(reply, req, profileId)
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
