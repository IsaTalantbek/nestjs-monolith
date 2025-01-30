import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { catchError, Observable, tap } from 'rxjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FileLoggerService } from './log/file.logger.service.js'
import { errorStatic } from './util/error/error.static.js'
import { ConfigService } from '@nestjs/config'
import { errorMessage } from './util/error/error.message.js'
import { ErrorLog } from './log/logger.base.service.js'
import { LOG_CONSTANT } from '../common/decorators/route/route.decorator.index.js'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private readonly config: ConfigService,
        private readonly loggerService: FileLoggerService
    ) {}

    giveMetadata(context: ExecutionContext) {
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
                return {}
            }

            baseFilePath = filename
            silentLog = silent
        } else {
            throw new Error(
                `Ошибка, не передан filename или silent ${filename}, ${silent}`
            )
        }
        return { baseFilePath, silentLog }
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        let { baseFilePath, silentLog } = this.giveMetadata(context)
        if (!baseFilePath) {
            return next.handle()
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

        const requestDATE = new Date().toISOString()

        return next.handle().pipe(
            tap(async (result) => {
                if (logFilePath === errorFilePath) {
                    return
                }
                this.loggerService.successLog(
                    logFilePath,
                    request,
                    result,
                    requestDATE
                )
                return result
            }),
            catchError(async (error) => {
                const errorDATE = new Date().toISOString()
                const reply: FastifyReply = context.switchToHttp().getResponse()

                if (error?.status && error?.status < 500) {
                    // Пропускаем ошибки валидации или не системные
                    const errorLog: ErrorLog =
                        this.loggerService.createErrorLog(
                            request,
                            error,
                            requestDATE,
                            errorDATE
                        )

                    this.loggerService.log(errorLog, logFilePath)

                    return reply.status(error.status).send(error.response)
                }

                this.loggerService.errorLog(
                    logFilePath,
                    request,
                    error,
                    requestDATE,
                    errorDATE
                )

                this.loggerService.errorLog(
                    errorFilePath,
                    request,
                    error,
                    requestDATE,
                    errorDATE
                )

                if (silentLog === true) {
                    return errorMessage(
                        reply,
                        request,
                        'получить нужные данные'
                    )
                } else {
                    return errorStatic(error, reply, request)
                }
            })
        )
    }
}
