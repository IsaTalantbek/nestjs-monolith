import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyRequest, FastifyReply } from 'fastify'
import { FileLoggerService } from '@core/log'
import { CriticalErrorException } from '@util/error'

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
            const filename = `${this.config.get<string>('DEFAULT_LOG_FILE')}/${this.config.get<string>('DEFAULT_ERROR_LOG_FILE')}.log`
            this.logService.errorLog(
                filename,
                request,
                error,
                requestDATE,
                errorDATE
            )
            throw new CriticalErrorException(
                request,
                undefined,
                'подтверждения личности'
            )
        }
    }
}
