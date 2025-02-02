import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { catchError, Observable, tap, throwError } from 'rxjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ConfigService } from '@nestjs/config'
import { LOG_CONSTANT } from './log.metadata.js'
import { FileLoggerService, ErrorLog } from '@log-services'
import { CriticalErrorException } from '@util-error'
import { BaseInterceptor } from '../base.interceptor.js'

@Injectable()
export class LoggerInterceptor extends BaseInterceptor {
    constructor(
        private reflector: Reflector,
        protected readonly config: ConfigService,
        protected readonly loggerService: FileLoggerService
    ) {
        super(config, loggerService)
    }

    async process(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        let { baseFilePath, silentLog, hideLog } = this.giveMetadata(context)

        if (!baseFilePath) {
            return next.handle()
        }
        const request: FastifyRequest = context.switchToHttp().getRequest()

        const { errorFilePath, logFilePath } = this.givePaths(baseFilePath)
        const requestDATE = new Date().toISOString()
        return next.handle().pipe(
            tap((result) => {
                if (logFilePath === errorFilePath) {
                    return
                }
                this.loggerService.successLog(
                    logFilePath,
                    request,
                    hideLog === true ? 'secret' : result,
                    requestDATE
                )
                return result
            }),
            catchError((error) => {
                const errorDATE = new Date().toISOString()

                if (error instanceof HttpException) {
                    // Пропускаем ошибки валидации и пользовательские (<500)
                    if (error.getStatus() < 500) {
                        const errorLog: ErrorLog =
                            this.loggerService.createErrorLog(
                                request,
                                error,
                                requestDATE,
                                errorDATE
                            )
                        this.loggerService.log(errorLog, logFilePath)
                        return throwError(() => error)
                    }
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

                throw new CriticalErrorException(
                    request,
                    silentLog === true ? undefined : error
                )
            })
        )
    }
    private giveMetadata(context: ExecutionContext) {
        let baseFilePath: string
        let silentLog: boolean
        let hideLog: boolean

        const { filename, silent, hide } =
            this.reflector.get<{
                filename: string
                silent: boolean
                hide: boolean
            }>(LOG_CONSTANT, context.getHandler()) ?? {}
        if (filename) {
            baseFilePath = filename
            hideLog = hide
            silentLog = silent
        } else if (!filename) {
            const { filename, silent, hide } =
                this.reflector.get<{
                    filename: string
                    silent: boolean
                    hide: boolean
                }>(LOG_CONSTANT, context.getClass()) ?? {}
            if (!filename) {
                return {}
            }

            baseFilePath = filename
            silentLog = silent
            hideLog = hide
        } else {
            throw new Error(
                `Ошибка, не передан filename, silent или hide: ${filename}, ${silent}, ${hide}`
            )
        }
        return { baseFilePath, silentLog, hideLog }
    }
    private givePaths(baseFilePath: string) {
        const defaultLogFile = this.config.get<string>('DEFAULT_LOG_FILE')

        const defaultErrorLogFile = this.config.get<string>(
            'DEFAULT_ERROR_LOG_FILE'
        )

        if (baseFilePath === 'default_log_file') {
            baseFilePath = defaultErrorLogFile
        }
        const errorFilePath: string = `${defaultLogFile}/${defaultErrorLogFile}.log`

        const logFilePath: string = `${defaultLogFile}/${baseFilePath}.log`

        return { errorFilePath, logFilePath }
    }
}
