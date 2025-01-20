import { UseInterceptors } from '@nestjs/common'
import { LogRequestInterceptor } from './logger.js'
import { LogErrorInterceptor } from './logger.error.js'

const interceptorCache = new Map<string, any>()

export function Log(path: string) {
    if (!interceptorCache.has(path)) {
        const interceptor =
            path === 'errors'
                ? new LogErrorInterceptor(`./messages/logs/${path}.log`)
                : new LogRequestInterceptor(`./messages/logs/${path}.log`)
        interceptorCache.set(path, interceptor)
    }

    return UseInterceptors(interceptorCache.get(path))
}
