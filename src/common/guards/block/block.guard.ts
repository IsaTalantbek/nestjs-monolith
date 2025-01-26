import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { IpAdressBlockService } from '../../../core/util/block/block.service.js'
import { Guard_BASE } from '../base.guard.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { LoggerService } from '../../../core/log/logger.service.js'

@Injectable()
export class IpAdressGuard extends Guard_BASE {
    constructor(
        private readonly blockManager: IpAdressBlockService,
        private readonly LoggerService: LoggerService
    ) {
        super(LoggerService)
    }

    async handleRequest(
        reply: FastifyReply,
        req: FastifyRequest
    ): Promise<boolean> {
        const ipAdress = req.ip

        // Если запрос блокирован, отклоняем новый
        if (this.blockManager.isLocked(ipAdress)) {
            reply.status(400).send({ message: 'Ваш запрос обрабатывается' })
            return false // отклонить запрос
        }

        // Иначе разрешаем продолжить
        this.blockManager.lock(ipAdress)
        return true
    }
}
