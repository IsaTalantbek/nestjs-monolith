import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { errorStatic } from '../../core/util/error/error.static.js'
import { LoggerService } from '../log/logger.service.js'

@Injectable()
export abstract class BaseGuard implements CanActivate {
    constructor(private readonly logService: LoggerService) {}

    abstract handleRequest(
        request: FastifyRequest,
        reply: FastifyReply
    ): boolean | Promise<boolean>

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<FastifyRequest>()
        const reply = context.switchToHttp().getResponse<FastifyReply>()

        const DATE = new Date().toISOString()
        try {
            return await this.handleRequest(request, reply)
        } catch (error) {
            errorStatic(
                error,
                reply,
                request,
                'Возникла ошибка при попытке авторизации, напишите нам, что случилось'
            )
            const requestLog = this.logService.requestSample(request, DATE)
            const errorLog = this.logService.errorSample(error)
            this.logService.error(requestLog + errorLog, './logs/errors.log')
            return false
        }
    }
}
