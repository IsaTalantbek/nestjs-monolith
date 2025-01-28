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
import { ConfigService } from '@nestjs/config'
import { errorMessage } from './util/error/error.message.js'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private readonly config: ConfigService,
        private readonly loggerService: LoggerService
    ) {}

    private async logProcess(
        result: any,
        logFilePath: string,
        errorFilePath: string,
        requestLog: string
    ): Promise<any> {
        if (logFilePath === errorFilePath) {
            return
        }
        const responseLog = this.loggerService.responseSample(result)

        const endLog = requestLog + responseLog

        this.loggerService.log(endLog, logFilePath)
        return result
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        let baseFilePath: string
        let silentLog: boolean

        const { filename, silent } =
            this.reflector.get<{ filename: string; silent: boolean }>(
                LOG_CONSTANT,
                context.getHandler()
            ) || {}
        if (filename) {
            baseFilePath = filename
            silentLog = silent
        } else if (!filename) {
            const { filename, silent } = this.reflector.get<{
                filename: string
                silent: boolean
            }>(LOG_CONSTANT, context.getClass())
            if (!filename) {
                return next.handle()
            }
            baseFilePath = filename
            silentLog = silent
        } else {
            throw new Error(
                `Ошибка, не передан filename или silent ${filename}, ${silent}`
            )
        }
        const request: FastifyRequest = context.switchToHttp().getRequest()
        const defaultLogFile = this.config.get<string>('DEFAULT_LOG_FILE')
        const defaultErrorLogFile = this.config.get<string>(
            'DEFAULT_ERROR_LOG_FILE'
        )
        if (baseFilePath === 'default_log_file') {
            baseFilePath = defaultErrorLogFile
        }
        const errorFilePath: string = `${defaultLogFile}/${defaultErrorLogFile}.log`
        const logFilePath: string = `${defaultLogFile}/${baseFilePath}.log`

        const requestLog: string = this.loggerService.requestSample(request)

        return next.handle().pipe(
            tap(async (result) => {
                return await this.logProcess(
                    result,
                    logFilePath,
                    errorFilePath,
                    requestLog
                )
            }),
            catchError(async (error) => {
                const reply = context.switchToHttp().getResponse()
                const req = context.switchToHttp().getRequest()

                if (error?.status && error?.status < 500) {
                    // Пропускаем ошибки валидации или не системные
                    const errorLog = this.loggerService.errorSample(error)

                    const endLog = requestLog + errorLog

                    this.loggerService.log(endLog, logFilePath)

                    return reply.status(error.status).send(error.response)
                }
                const errorLog = this.loggerService.errorSample(error)

                const endLog = requestLog + errorLog

                this.loggerService.error(endLog, logFilePath)

                this.loggerService.error(endLog, errorFilePath)
                if (silentLog === true) {
                    return errorMessage(reply, req, 'получить нужные данные')
                } else {
                    return errorStatic(error, reply, req)
                }
            })
        )
    }
}
