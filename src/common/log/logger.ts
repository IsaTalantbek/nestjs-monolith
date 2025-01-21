import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, from } from 'rxjs'
import * as fs from 'fs/promises'
import { errorStatic } from '../../core/util/error/error.static.js'
import { LoggerService } from './logger.service.js'

@Injectable()
export class LogRequestInterceptor {
    constructor(
        private logPath: string,
        private readonly logService: LoggerService
    ) {}

    private async createLogEntry(
        context: ExecutionContext,
        DATE: string,
        result?: any,
        error?: any
    ): Promise<string> {
        const request = context.switchToHttp().getRequest()
        const logEntry = `
--- START ${DATE} ---

- Request -
URL: ${request.url}
Method: ${request.method}
User: ${JSON.stringify(request.user)} 
Headers: ${JSON.stringify(request.headers.cookie)} 
Params: ${JSON.stringify(request.params)} 
Body: ${JSON.stringify(request.body)} 
Query: ${JSON.stringify(request.query)} 
`
        const resultLog = result
            ? `
- Response -
Result: ${JSON.stringify(result)}

--- END ${new Date().toISOString()} ---
`
            : ''

        const errorLog = error
            ? `
- Error -
Message: ${error.message || 'Unknown error'}
Stack: ${error.stack || 'No stack trace'}

--- END ${new Date().toISOString()} ---
`
            : ''

        return logEntry + resultLog + errorLog
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        const DATE = new Date().toISOString()

        return from(
            (async () => {
                try {
                    // Достаём результат из потока
                    const result = await next.handle().toPromise()
                    // Логируем ответ вместе с запросом в одну запись
                    const logMessage = await this.createLogEntry(
                        context,
                        DATE,
                        result
                    )
                    await this.logService.logToFile(logMessage, this.logPath)
                    return result
                } catch (error) {
                    const reply = context.switchToHttp().getResponse()
                    if (error?.status >= 500 || !error.status) {
                        // Логируем ошибку вместе с запросом в одну запись

                        const logMessage = await this.createLogEntry(
                            context,
                            DATE,
                            undefined,
                            error
                        )
                        await this.logService.createErrorLogEntry(
                            error,
                            context,
                            DATE
                        )
                        await this.logService.logToFile(
                            logMessage,
                            this.logPath
                        )
                        return errorStatic(
                            error,
                            reply,
                            context.switchToHttp().getRequest()
                        )
                    }
                    const logMessage = await this.createLogEntry(
                        context,
                        DATE,
                        undefined,
                        error.response
                    )
                    await this.logService.logToFile(logMessage, this.logPath)
                    return reply.status(error.status).send(error.response)
                }
            })()
        )
    }
}
