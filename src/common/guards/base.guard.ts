import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { errorStatic } from '../../core/util/error/error.static.js'
import { LoggerService } from '../../core/log/logger.service.js'

@Injectable()
export abstract class Guard_BASE implements CanActivate {
    constructor(private readonly logService: LoggerService) {}

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
                'Возникла ошибка при попытке авторизации, напишите нам, что случилось'
            )
            const requestLog: string = this.logService.requestSample(
                request,
                DATE
            )
            const errorLog: string = this.logService.errorSample(error)
            this.logService.error(
                requestLog + errorLog,
                `${process.env.DEFAULT_LOG_FILE}/errors.log`
            )
            return false
        }
    }
}
