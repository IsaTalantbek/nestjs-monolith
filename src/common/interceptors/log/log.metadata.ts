import { LoggerInterceptor } from './log.interceptor.js'

export const LOG_CONSTANT = 'logging_file'

export interface LogMetadataInterface {
    filename: string
    silent: boolean
    hide: boolean
}

export function UseLoggerInterceptor({
    filename,
    silent,
    hide,
}: LogMetadataInterface) {
    return {
        use: LoggerInterceptor,
        key: LOG_CONSTANT,
        metadata: { filename, silent, hide },
    }
}
