import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { catchError, Observable, tap } from 'rxjs'
import { FastifyRequest } from 'fastify'
import { LoggerService } from './log/logger.service.js'
import { LOG_CONSTANT } from '../common/decorators/logger.decorator.js'
import { errorStatic } from './util/error/error.static.js'

@Injectable()
export class AppInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private readonly loggerService: LoggerService
    ) {}

    private async logProcess(result, baseFilePath, errorFilePath, requestLog) {
        if (baseFilePath === errorFilePath) {
            return
        }
        const responseLog = this.loggerService.responseSample(result)

        const endLog = requestLog + responseLog

        this.loggerService.log(endLog, baseFilePath)
        return result
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        let baseFilePath
        baseFilePath = this.reflector.get<string>(
            LOG_CONSTANT,
            context.getHandler()
        )
        if (!baseFilePath) {
            baseFilePath = this.reflector.get<string>(
                LOG_CONSTANT,
                context.getClass()
            )
            return next.handle()
        }
        const request: FastifyRequest = context.switchToHttp().getRequest()
        const errorFilePath = `${process.env.DEFAULT_LOG_FILE}/errors.log`
        const requestLog = this.loggerService.requestSample(request)
        return next.handle().pipe(
            tap(async (result) => {
                return await this.logProcess(
                    result,
                    baseFilePath,
                    errorFilePath,
                    requestLog
                )
            }),
            catchError(async (error) => {
                const reply = context.switchToHttp().getResponse()
                const req = context.switchToHttp().getRequest()

                if (error?.status && error?.status < 500) {
                    // Пропускаем ошибки валидации или не системные
                    return reply.status(error.status).send(error.response)
                }

                const errorLog = this.loggerService.errorSample(error)

                const endLog = requestLog + errorLog

                this.loggerService.error(endLog, baseFilePath)
                this.loggerService.error(endLog, errorFilePath)

                return errorStatic(error, reply, req)
            })
        )
    }
}
