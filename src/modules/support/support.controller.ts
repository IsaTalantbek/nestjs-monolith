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
import { JwtCheck } from 'src/common/guards/jwt/jwt.check'
import { SupportService } from './support.service'
import { SupportBodyDto } from './support.dto'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller('support')
@UseGuards(JwtCheck)
export class SupportController {
    constructor(private readonly supportService: SupportService) {}

    @Post()
    async writeSupport(
        @Req() req: FastifyRequest,
        @Body() bodyDto: SupportBodyDto,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user?.accountId
            const { text } = bodyDto
            await this.supportService.writeSupport(text, accountId)
            return reply
                .status(200)
                .send({ message: 'Ваше сообщение успешно отправлено' })
        } catch (error) {
            console.error(`Write-Support: ${error}`)
            return reply.status(500).send({
                message: 'Возникла ошибка при попытке написать в поддержку',
            })
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
            const result = await this.supportService.readSupport(
                accountId,
                fileOption
            )
            return reply.status(200).send(result)
        } catch (error) {
            console.error(`Read-Support: ${error}`)
            return reply.status(500).send({
                message: 'Возникла ошибка при попытке прочитать файлы',
                error,
            })
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
            const result = await this.supportService.clearSupport(
                accountId,
                fileOption
            )
            return reply.status(200).send(result)
        } catch (error) {
            console.error(`Clear-Support: ${error}`)
            return reply.status(500).send({
                message: 'Возникла ошибка при попытке удалить файлы',
                error,
            })
        }
    }
}
