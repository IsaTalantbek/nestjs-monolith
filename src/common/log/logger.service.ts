import { Injectable } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import * as winston from 'winston'

@Injectable()
export class LoggerService {
    private readonly loggers: Record<string, winston.Logger> = {}
    private readonly maxLoggers = 100 // Максимальное количество логеров (настраиваемое)

    private safeJSON(obj) {
        try {
            return JSON.stringify(obj, null, 2)
        } catch {
            return '[Unserializable Object]'
        }
    }

    public requestSample(request: FastifyRequest, DATE?: any) {
        return `
--- START ${DATE || new Date().toISOString()} ---

- Request -
URL: ${request.url}
Method: ${request.method}
Cookie: ${this.safeJSON(request.headers.cookie)}
Params: ${this.safeJSON(request.params)}
Body: ${this.safeJSON(request.body)}
Query: ${this.safeJSON(request.query)}
`
    }

    public responseSample(result: any) {
        return `
- Response -
Status: 200
Data: ${this.safeJSON(result)}

--- END ${new Date().toISOString()} ---
            
`
    }

    public errorSample(error: any) {
        return `
- Error -
Status: ${error?.status || 500}
Message: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace'}

--- END ${new Date().toISOString()} ---
`
    }

    private cleanupOldLoggers(): void {
        const keys = Object.keys(this.loggers)
        if (keys.length > this.maxLoggers) {
            const oldestKey = keys[0]
            this.loggers[oldestKey].close() // Закрываем transports
            delete this.loggers[oldestKey] // Удаляем из памяти
        }
    }

    private getLogger(filePath: string): winston.Logger {
        if (!this.loggers[filePath]) {
            // Проверяем лимит и очищаем старые логеры
            this.cleanupOldLoggers()

            // Создаём новый логер
            this.loggers[filePath] = winston.createLogger({
                level: 'info',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.printf(({ message }) => `${message}`)
                ),
                transports: [
                    new winston.transports.File({ filename: filePath }),
                ],
            })
        }
        return this.loggers[filePath]
    }

    log(message: string, filePath: string): void {
        const logger = this.getLogger(filePath)
        logger.info(message)
    }

    error(message: string, filePath: string): void {
        const logger = this.getLogger(filePath)
        logger.error(message)
    }
}
