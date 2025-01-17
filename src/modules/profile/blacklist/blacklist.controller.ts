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
import { errorStatic } from '../../../core/util/error.static.js'

@Controller('profile/blacklist')
@UseGuards(SessionGuard)
export class BlackListController {
    constructor(private readonly blacklist: BlackLIstService) {}

    @Get()
    async getBlackList(@Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        try {
            const accountId = req.user.accountId
            const result = await this.blacklist.getBlackList(accountId)
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(
                error,
                reply,
                'GET-BLACKLIST',
                'загрузки черного списка'
            )
            return
        }
    }

    @UsePipes(ParamUuidPipe)
    @Post(':vsPid')
    async addToBlackList(
        @Param('vsPid') vsPid: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
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
        } catch (error) {
            errorStatic(
                error,
                reply,
                'ADD-BLACKLIST',
                'добавить пользователя в черный список'
            )
            return
        }
    }

    @UsePipes(ParamUuidPipe)
    @Put(':vsPid')
    async deleteFromBlackList(
        @Param('vsPid') vsPid: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
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
        } catch (error) {
            errorStatic(
                error,
                reply,
                'DELETE-BLACKLIST',
                'удалить пользователя из черного списка'
            )
            return
        }
    }

    @Delete()
    async deleteAllFromBlackList(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            const accountId = req.user.accountId
            const result =
                await this.blacklist.deleteAllFromBlackList(accountId)
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply.status(200).send({
                message: 'Пользователи успешно удалены из черного списка',
            })
        } catch (error) {
            errorStatic(
                error,
                reply,
                'DELETE-ALL-BLACKLIST',
                'удалить всех из черного списка'
            )
            return
        }
    }
}
