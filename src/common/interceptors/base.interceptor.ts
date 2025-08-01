import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable, of } from 'rxjs'
import { FileLoggerService } from '@core/log'
import { CriticalErrorException } from '@util/error'

@Injectable()
export abstract class BaseInterceptor implements NestInterceptor {
    constructor(
        protected readonly config: ConfigService,
        protected readonly logService: FileLoggerService
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        const requestDATE: string = new Date().toISOString()
        try {
            return await this.process(context, next)
        } catch (error) {
            const request = context.switchToHttp().getRequest()

            const errorDATE: string = new Date().toISOString()
            const filename = `${this.config.get<string>('DEFAULT_LOG_FILE')}/${this.config.get<string>('DEFAULT_ERROR_LOG_FILE')}.log`
            this.logService.errorLog(
                filename,
                request,
                error,
                requestDATE,
                errorDATE
            )

            of({
                success: false,
                message: 'Error handled within interceptor',
            })
            throw new CriticalErrorException(request)
        }
    }
    abstract process(context, next): Promise<Observable<any>> | Observable<any>
}
