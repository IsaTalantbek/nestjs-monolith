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
import { JwtCheck } from '../../common/guards/jwt/jwt.check.js'
import { errorStatic } from '../../core/util/error.static.js'

@Controller('support')
@UseGuards(JwtCheck)
export class SupportController {
    constructor(private readonly support: SupportService) {}

    @Post()
    async writeSupport(
        @Req() req: FastifyRequest,
        @Body() bodyDto: SupportBodyDto,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user?.accountId
            const { text } = bodyDto
            await this.support.writeSupport(text, accountId)
            return reply
                .status(200)
                .send({ message: 'Ваше сообщение успешно отправлено' })
        } catch (error) {
            errorStatic(
                error,
                reply,
                'WRITE-SUPPORT',
                'отправки сообщение поддержке'
            )
            return
        }
    }
    @Get(':fileOption')
    async readSupport(
        @Param('fileOption') option: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            const accountId = req.user.accountId
            const fileOption = parseInt(option, 10)
            const result = await this.support.readSupport(accountId, fileOption)
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(
                error,
                reply,
                'READ-SUPPORT',
                'Охереть, а че теперь? Сообщите нам как нибудь пожалуйста, я бедный бэкэндер'
            )
            return
        }
    }
    @Delete(':fileOption')
    async clearSupport(
        @Param('fileOption') option: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            const accountId = req.user.accountId
            const fileOption = parseInt(option, 10)
            const result = await this.support.clearSupport(
                accountId,
                fileOption
            )
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(
                error,
                reply,
                'CLEAR-SUPPORT',
                'удалить файлы с сообщениями'
            )
            return
        }
    }
}
