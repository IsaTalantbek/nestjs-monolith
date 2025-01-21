import { UseInterceptors } from '@nestjs/common'
import { LogRequestInterceptor } from '../log/logger.js'
import { LogErrorInterceptor } from '../log/logger.error.js'
import { LoggerService } from '../log/logger.service.js'

const interceptorCache = new Map<string, any>()

export function Log(path?: string) {
    if (!interceptorCache.has(path)) {
        const interceptor = !path
            ? new LogErrorInterceptor(new LoggerService())
            : new LogRequestInterceptor(
                  `./messages/logs/${path}.log`,
                  new LoggerService()
              )
        interceptorCache.set(path, interceptor)
    }

    return UseInterceptors(interceptorCache.get(path))
}
