import { ExecutionContext, Injectable } from '@nestjs/common'
import { Guard_BASE } from '../base.guard.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Reflector } from '@nestjs/core'
import { LoggerService } from '../../../core/log/logger.service.js'
import { SESSION_GUARD_CONSTANT } from '../../../common/decorators/guard.decorator.js'
import { SessionAuthorized } from './service/session.authorized.service.js'
import { SessionUnauthorized } from './service/session.unauthorized.service.js'
import { SessionCheck } from './service/session.check.service.js'
import { SGM } from './session.guard.enum.js'

@Injectable()
export class SessionGuard extends Guard_BASE {
    constructor(
        private readonly reflector: Reflector,
        private readonly authorized: SessionAuthorized,
        private readonly unauthorized: SessionUnauthorized,
        private readonly check: SessionCheck,
        private readonly loggerService: LoggerService
    ) {
        super(loggerService)
    }

    protected async handleRequest(
        reply: FastifyReply,
        req: FastifyRequest,
        context: ExecutionContext
    ): Promise<boolean> {
        let metadata
        metadata = this.reflector.get<string>(
            SESSION_GUARD_CONSTANT,
            context.getHandler()
        )
        if (!metadata) {
            metadata = this.reflector.get<string>(
                SESSION_GUARD_CONSTANT,
                context.getClass()
            )
        }
        switch (metadata) {
            case SGM.unauthorized:
                return await this.unauthorized.use(reply, req)
            case SGM.authorized:
                return await this.authorized.use(reply, req)
            case SGM.check:
                return await this.check.use(reply, req)
        }
    }
}
