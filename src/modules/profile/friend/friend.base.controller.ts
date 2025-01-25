import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { SessionGuard } from '../../../common/guards/session/session.guard.js'
import { ParamUuidPipe } from '../../../common/pipes/paramUUID.pipe.js'
import { Log } from '../../../common/decorators/logger.decorator.js'
import { UUID } from 'crypto'
import { ActiveWaitingFriendDTO } from './sample/friend.dto.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FriendService } from './friend.service.js'

@Log()
@UseGuards(SessionGuard)
@Controller('profile/friends')
export abstract class FriendController_BASE {
    constructor(protected readonly service: FriendService) {}

    @Get(':option')
    async giveFriends_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('option') optionDTO: ActiveWaitingFriendDTO
    ) {
        return await this.giveFriends(reply, req, optionDTO)
    }
    @UsePipes(ParamUuidPipe)
    @Post(':vsAid')
    async addFriend_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('vsAid') vsAid: UUID
    ) {
        return await this.addFriend(reply, req, vsAid)
    }
    @UsePipes(ParamUuidPipe)
    @Put(':friendId')
    async acceptFriend_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('friendId') friendId: UUID
    ) {
        return await this.acceptFriend(reply, req, friendId)
    }
    @UsePipes(ParamUuidPipe)
    @Delete('friendId')
    async deleteFriend_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('friendId') friendAid: UUID
    ) {
        return await this.deleteFriend(reply, req, friendAid)
    }

    protected abstract giveFriends(
        reply: FastifyReply,
        req: FastifyRequest,
        option: ActiveWaitingFriendDTO
    )
    protected abstract addFriend(
        reply: FastifyReply,
        req: FastifyRequest,
        vsAid: UUID
    )
    protected abstract acceptFriend(
        reply: FastifyReply,
        req: FastifyRequest,
        friendAid: UUID
    )
    protected abstract deleteFriend(
        reply: FastifyReply,
        req: FastifyRequest,
        friendAid: UUID
    )
}
