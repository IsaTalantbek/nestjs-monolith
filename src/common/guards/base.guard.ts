import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { errorStatic } from '../../core/util/error/error.static.js'
import { FileLoggerService } from '../../core/log/file.logger.service.js'
import { ConfigService } from '@nestjs/config'

@Injectable()
export abstract class Guard_BASE implements CanActivate {
    constructor(
        private readonly logService: FileLoggerService,
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

        const requestDATE: string = new Date().toISOString()
        try {
            return await this.handleRequest(reply, request, context)
        } catch (error) {
            const errorDATE: string = new Date().toISOString()
            errorStatic(
                error,
                reply,
                request,
                'Возникла ошибка при попытке авторизации, если это вам мешает, напишите что случилось'
            )
            const filename = `${this.config.get<string>('DEFAULT_LOG_FILE')}/${this.config.get<string>('DEFAULT_ERROR_LOG_FILE')}.log`
            this.logService.errorLog(
                filename,
                request,
                error,
                requestDATE,
                errorDATE
            )
            return false
        }
    }
}
