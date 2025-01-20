import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, from } from 'rxjs'
import * as fs from 'fs/promises'
import { errorStatic } from '../../core/util/error/error.static.js'

@Injectable()
export class LogErrorInterceptor {
    constructor(private logPath: string) {}

    private async logToFile(message: string): Promise<void> {
        try {
            await fs.appendFile(this.logPath, message)
        } catch (fileError) {
            console.error('Failed to write log:', fileError)
        }
    }

    private async logError(
        error: any,
        context: ExecutionContext,
        DATE: Date
    ): Promise<void> {
        const request = context.switchToHttp().getRequest()
        const errorLog = `
--- Request ---
URL: ${request.url}
Method: ${request.method}
User: ${JSON.stringify(request.user)} 
Headers: ${JSON.stringify(request.headers)} 
Params: ${JSON.stringify(request.params)} 
Body: ${JSON.stringify(request.body)} 
Query: ${JSON.stringify(request.query)} 
Date: ${DATE}

--- Error ---
Message: ${error.message || 'Unknown error'}
Stack: ${error.stack || 'No stack trace'}
Date: ${DATE}
`
        await this.logToFile(errorLog)
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        const DATE = new Date() // Единственная временная метка для всех ошибок
        return from(
            (async () => {
                try {
                    return await next.handle().toPromise()
                } catch (error) {
                    const reply = context.switchToHttp().getResponse()
                    if (error?.status >= 500 || !error.status) {
                        await this.logError(error, context, DATE)
                        return errorStatic(
                            error,
                            reply,
                            context.switchToHttp().getRequest()
                        )
                    }
                    return reply.status(error.status).send(error.response)
                }
            })()
        )
    }
}
