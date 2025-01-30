import { ExecutionContext, Injectable } from '@nestjs/common'
import { Guard_BASE } from '../base.guard.js'
import { Reflector } from '@nestjs/core'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FileLoggerService } from '../../../core/log/file.logger.service.js'
import { ROLE_GUARD_CONSTANT } from '../../../common/decorators/route/route.decorator.index.js'
import { RoleCheck } from './service/role.check.service.js'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RoleGuard extends Guard_BASE {
    constructor(
        private readonly reflector: Reflector,
        private readonly check: RoleCheck,
        private readonly loggerService: FileLoggerService,
        private readonly configService: ConfigService
    ) {
        super(loggerService, configService)
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
                return true
            }
        }
        return await this.check.use(req, metadata)
    }
}
