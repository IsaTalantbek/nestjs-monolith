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
import { FastifyReply, FastifyRequest } from 'fastify'
import { BlacklistService } from './blacklist.service.js'
import { ParamUuidPipe } from '../../../common/pipes/paramUUID.pipe.js'
import { UUID } from 'crypto'
import { GiveBlacklistDTO } from './sample/blacklist.dto.js'

@Controller('profile/blacklist')
export abstract class BlackListController_BASE {
    constructor(protected readonly service: BlacklistService) {}

    @Get()
    async giveBlacklist_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        return await this.giveBlacklist(reply, req)
    }

    @UsePipes(ParamUuidPipe)
    @Post(':vsPid')
    async addToBlacklist_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('vsPid') vsPid: UUID
    ) {
        return await this.addToBlacklist(reply, req, vsPid)
    }

    @UsePipes(ParamUuidPipe)
    @Put(':vsPid')
    async deleteToBlacklist_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('vsPid') vsPid: UUID
    ) {
        return await this.deleteToBlacklist(reply, req, vsPid)
    }

    @Delete()
    async deleteAllToBlacklist_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        return await this.deleteAllToBlacklist(reply, req)
    }

    protected abstract giveBlacklist(
        reply: FastifyReply,
        req: FastifyRequest
    ): Promise<GiveBlacklistDTO[]>

    protected abstract addToBlacklist(
        reply: FastifyReply,
        req: FastifyRequest,
        vsPid: UUID
    ): Promise<string>

    protected abstract deleteToBlacklist(
        reply: FastifyReply,
        req: FastifyRequest,
        vsPid: UUID
    ): Promise<string>

    protected abstract deleteAllToBlacklist(
        reply: FastifyReply,
        req: FastifyRequest
    ): Promise<string>
}
