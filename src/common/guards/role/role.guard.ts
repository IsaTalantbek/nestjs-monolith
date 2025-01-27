import { ExecutionContext, Injectable } from '@nestjs/common'
import { Guard_BASE } from '../base.guard.js'
import { Reflector } from '@nestjs/core'
import { FastifyReply, FastifyRequest } from 'fastify'
import { LoggerService } from '../../../core/log/logger.service.js'
import { ROLE_GUARD_CONSTANT } from '../../../common/decorators/guard.decorator.js'
import { RoleCheck } from './service/role.check.service.js'

@Injectable()
export class RoleGuard extends Guard_BASE {
    constructor(
        private readonly reflector: Reflector,
        private readonly check: RoleCheck,
        private readonly loggerService: LoggerService
    ) {
        super(loggerService)
    }

    protected async handleRequest(
        reply: FastifyReply,
        req: FastifyRequest,
        context?: ExecutionContext
    ): Promise<boolean> {
        let metadata
        metadata = this.reflector.get<string>(
            ROLE_GUARD_CONSTANT,
            context.getHandler()
        )
        if (!metadata) {
            metadata = this.reflector.get<string>(
                ROLE_GUARD_CONSTANT,
                context.getClass()
            )
            if (!metadata) {
                throw new Error('Вы указали неправильную роль в гварде')
            }
        }
        return await this.check.use(req, metadata)
    }
}
