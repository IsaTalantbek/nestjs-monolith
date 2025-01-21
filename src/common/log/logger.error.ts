import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, from } from 'rxjs'
import { errorStatic } from '../../core/util/error/error.static.js'
import { LoggerService } from './logger.service.js'

@Injectable()
export class LogErrorInterceptor {
    constructor(private logService: LoggerService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        const DATE = new Date().toISOString() // Единственная временная метка для всех ошибок
        return from(
            (async () => {
                try {
                    return await next.handle().toPromise()
                } catch (error) {
                    const reply = context.switchToHttp().getResponse()
                    if (error?.status >= 500 || !error.status) {
                        await this.logService.createErrorLogEntry(
                            error,
                            context,
                            DATE
                        )
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
