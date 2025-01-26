import { FastifyReply, FastifyRequest } from 'fastify'
import { SupportBodyDTO } from './sample/support.dto.js'
import { SupportService } from './support.service.js'
import { SessionCheck } from '../../../common/guards/session/service/session.check.service.js'
import { Log } from '../../../common/decorators/logger.decorator.js'
import { SupportController_BASE } from './support.base.controller.js'

export class SupportController extends SupportController_BASE {
    constructor(private readonly supportService: SupportService) {
        super(supportService)
    }

    async writeSupport(
        reply: FastifyReply,
        req: FastifyRequest,
        bodyDto: SupportBodyDTO
    ): Promise<string> {
        const accountId = req.user?.accountId
        const { text } = bodyDto
        await this.service.writeSupport(text, accountId)
        const message = 'Ваше сообщение успешно отправлено'
        reply.status(200).send({ message: message })
        return message
    }

    async readSupport(
        reply: FastifyReply,
        req: FastifyRequest,
        option: string
    ): Promise<string> {
        const accountId = req.user!.accountId
        const fileOption = parseInt(option, 10)
        const result: string = await this.service.readSupport(
            fileOption,
            accountId
        )
        if (result === 'Не имеете доступа') {
            reply.status(400).send({ message: result })
        } else {
            reply.status(200).send(result)
        }
        return result
    }

    async clearSupport(
        reply: FastifyReply,
        req: FastifyRequest,
        option: string
    ): Promise<string> {
        const accountId = req.user!.accountId
        const fileOption = parseInt(option, 10)
        const result: true | string = await this.service.clearSupport(
            fileOption,
            accountId
        )
        if (result !== true) {
            reply.status(400).send({ message: result })
            return result
        } else {
            const message = 'ВЫ успешно очистили файлы'
            reply.status(200).send({ message: message })
            return message
        }
    }
}
