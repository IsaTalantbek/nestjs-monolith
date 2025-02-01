import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ConfigService } from '@nestjs/config'
import { IpAdressBlockService } from '@util-ip-block'
import { FileLoggerService } from '@log-services'
import { Guard_BASE } from '../base.guard.js'

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
