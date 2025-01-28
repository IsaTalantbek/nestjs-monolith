import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { errorStatic } from '../../core/util/error/error.static.js'
import { LoggerService } from '../../core/log/logger.service.js'
import { ConfigService } from '@nestjs/config'

@Injectable()
export abstract class Guard_BASE implements CanActivate {
    constructor(
        private readonly logService: LoggerService,
        private readonly config: ConfigService
    ) {}

    protected abstract handleRequest(
        reply: FastifyReply,
        request: FastifyRequest,
        context?: ExecutionContext
    ): Promise<boolean>

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<FastifyRequest>()
        const reply = context.switchToHttp().getResponse<FastifyReply>()

        const DATE: string = new Date().toISOString()
        try {
            return await this.handleRequest(reply, request, context)
        } catch (error) {
            errorStatic(
                error,
                reply,
                request,
                'Возникла ошибка при попытке авторизации, если это вам мешает, напишите что случилось'
            )
            const requestLog: string = this.logService.requestSample(
                request,
                DATE
            )
            const errorLog: string = this.logService.errorSample(error)
            this.logService.error(
                requestLog + errorLog,
                `${this.config.get<string>('DEFAULT_LOG_FILE')}/${this.config.get<string>('DEFAULT_ERROR_LOG_FILE')}.log`
            )
            return false
        }
    }
}
