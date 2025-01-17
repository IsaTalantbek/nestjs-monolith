import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { IpAdressBlockManager } from '../../../core/util/block.manager.js'
import { BaseGuard } from '../base.guard.js'
import { FastifyReply, FastifyRequest } from 'fastify'

@Injectable()
export class IpAdressGuard extends BaseGuard {
    constructor(private readonly blockManager: IpAdressBlockManager) {
        super()
    }

    async handleRequest(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<boolean> {
        const ipAdress = request.ip

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
