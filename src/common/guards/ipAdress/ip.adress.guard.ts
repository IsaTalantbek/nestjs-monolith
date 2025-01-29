import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { IpAdressBlockService } from '../../../core/util/block/block.service.js'
import { Guard_BASE } from '../base.guard.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FileLoggerService } from '../../../core/log/file.logger.service.js'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class IpAdressGuard extends Guard_BASE {
    constructor(
        private readonly blockManager: IpAdressBlockService,
        private readonly loggerService: FileLoggerService,
        private readonly configService: ConfigService
    ) {
        super(loggerService, configService)
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
