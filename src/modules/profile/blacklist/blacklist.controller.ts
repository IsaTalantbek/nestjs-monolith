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
import { SessionGuard } from '../../../common/guards/session/session.guard.js'
import { BlackLIstService } from './blacklist.service.js'
import { ParamUuidPipe } from '../../../common/pipes/paramUUID.pipe.js'
import { Log } from '../../../common/log/log.js'

@Controller('profile/blacklist')
@UseGuards(SessionGuard)
@Log('errors')
export class BlackListController {
    constructor(private readonly blacklist: BlackLIstService) {}

    @Get()
    async getBlackList(@Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        const accountId = req.user.accountId
        const result = await this.blacklist.getBlackList(accountId)
        return reply.status(200).send(result)
    }

    @UsePipes(ParamUuidPipe)
    @Post(':vsPid')
    async addToBlackList(
        @Param('vsPid') vsPid: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        const accountId = req.user.accountId
        const result = await this.blacklist.addToBlackList({
            accountId,
            vsPid,
        })
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply.status(200).send({
            message: 'Пользователь успешно добавлен в черный список',
        })
    }

    @UsePipes(ParamUuidPipe)
    @Put(':vsPid')
    async deleteFromBlackList(
        @Param('vsPid') vsPid: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        const accountId = req.user.accountId
        const result = await this.blacklist.deleteFromBlackList({
            accountId,
            vsPid,
        })
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply.status(200).send({
            message: 'Пользователь успешно удален из черного списка',
        })
    }

    @Delete()
    async deleteAllFromBlackList(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        const accountId = req.user.accountId
        const result = await this.blacklist.deleteAllFromBlackList(accountId)
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply.status(200).send({
            message: 'Пользователи успешно удалены из черного списка',
        })
    }
}
