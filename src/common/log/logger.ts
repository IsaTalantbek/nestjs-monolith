import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, from } from 'rxjs'
import * as fs from 'fs/promises'
import { errorStatic } from '../../core/util/error/error.static.js'

@Injectable()
export class LogRequestInterceptor {
    constructor(private logPath: string) {}

    private async logToFile(message: string): Promise<void> {
        try {
            await fs.appendFile(this.logPath, message)
        } catch (fileError) {
            console.error('Failed to write log:', fileError)
        }
    }

    private async logError(message: string): Promise<void> {
        try {
            await fs.appendFile('./messages/logs/errors.log', message)
        } catch (error) {
            console.error('Failed to write log:', error)
        }
    }

    private async createLogEntry(
        context: ExecutionContext,
        DATE: string,
        result?: any,
        error?: any
    ): Promise<string> {
        const request = context.switchToHttp().getRequest()
        const logEntry = `
--- Request ---
Date: ${DATE}
URL: ${request.url}
Method: ${request.method}
User: ${JSON.stringify(request.user)} 
Headers: ${JSON.stringify(request.headers)} 
Params: ${JSON.stringify(request.params)} 
Body: ${JSON.stringify(request.body)} 
Query: ${JSON.stringify(request.query)} 
`

        const resultLog = result
            ? `
--- Response ---
Result: ${JSON.stringify(result)}
`
            : ''

        const errorLog = error
            ? `
--- Error ---
Message: ${error.message || 'Unknown error'}
Stack: ${error.stack || 'No stack trace'}
Date: ${DATE}
`
            : ''

        return logEntry + resultLog + errorLog
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        const DATE = new Date().toISOString()
        let logMessage = ''

        return from(
            (async () => {
                try {
                    // Достаём результат из потока
                    const result = await next.handle().toPromise()
                    // Логируем ответ вместе с запросом в одну запись
                    logMessage = await this.createLogEntry(
                        context,
                        DATE,
                        result
                    )
                    await this.logToFile(logMessage)
                    return result
                } catch (error) {
                    const reply = context.switchToHttp().getResponse()
                    if (error?.status >= 500 || !error.status) {
                        // Логируем ошибку вместе с запросом в одну запись

                        logMessage = await this.createLogEntry(
                            context,
                            DATE,
                            undefined,
                            error
                        )
                        await this.logToFile(logMessage)
                        await this.logError(logMessage)
                        return errorStatic(
                            error,
                            reply,
                            context.switchToHttp().getRequest()
                        )
                    }
                    logMessage = await this.createLogEntry(
                        context,
                        DATE,
                        undefined,
                        error.response
                    )
                    await this.logToFile(logMessage)
                    return reply.status(error.status).send(error.response)
                }
            })()
        )
    }
}
