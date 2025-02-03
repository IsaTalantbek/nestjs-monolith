import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FileLoggerService } from '@core/log'
import { Guard_BASE } from '../base.guard.js'
import { SessionAuthorized } from './service/session.authorized.service.js'
import { SessionUnauthorized } from './service/session.unauthorized.service.js'
import { SessionCheck } from './service/session.check.service.js'
import { SESSION_GUARD_CONSTANT, SGM } from './session.guard.metadata.js'

@Injectable()
export class SessionGuard extends Guard_BASE {
    constructor(
        private readonly reflector: Reflector,
        private readonly authorized: SessionAuthorized,
        private readonly unauthorized: SessionUnauthorized,
        private readonly check: SessionCheck,
        private readonly loggerService: FileLoggerService,
        private readonly configService: ConfigService
    ) {
        super(loggerService, configService)
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
            if (!metadata) {
                throw new Error(
                    'Вы не выбрали гвард для какого-то маршрута. Он должен быть обязателен'
                )
            }
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
