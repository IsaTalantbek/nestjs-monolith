import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SupportBodyDto } from './support.dto.js'
import { SupportService } from './support.service.js'
import { SessionCheck } from '../../common/guards/session/session.check.js'
import { Log } from '../../common/log/log.js'

@Controller('support')
@UseGuards(SessionCheck)
@Log('errors')
export class SupportController {
    constructor(private readonly support: SupportService) {}

    @Post()
    async writeSupport(
        @Body() bodyDto: SupportBodyDto,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const accountId = req.user?.accountId
        const { text } = bodyDto
        await this.support.writeSupport(text, accountId)
        return reply
            .status(200)
            .send({ message: 'Ваше сообщение успешно отправлено' })
    }
    @Get(':fileOption')
    async readSupport(
        @Param('fileOption') option: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        const accountId = req.user.accountId
        const fileOption = parseInt(option, 10)
        const result = await this.support.readSupport(fileOption, accountId)
        return reply.status(200).send(result)
    }
    @Delete(':fileOption')
    async clearSupport(
        @Param('fileOption') option: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        const accountId = req.user.accountId
        const fileOption = parseInt(option, 10)
        const result = await this.support.clearSupport(fileOption, accountId)
        return reply.status(200).send(result)
    }
}
