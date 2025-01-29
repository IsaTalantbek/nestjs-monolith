import { Injectable } from '@nestjs/common'
import * as winston from 'winston'
import { ErrorLog, LoggerService, SuccessLog } from './logger.base.service.js'
import { FastifyRequest } from 'fastify'

@Injectable()
export class FileLoggerService extends LoggerService {
    private readonly loggers: Record<string, winston.Logger> = {}
    private readonly maxLoggers = 100 // Максимальное количество логеров (настраиваемое)

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
                    winston.format.json({ deterministic: false })
                ),
                transports: [
                    new winston.transports.File({ filename: filePath }),
                ],
            })
        }
        return this.loggers[filePath]
    }

    public log(
        message: string | SuccessLog | ErrorLog,
        filePath: string
    ): void {
        const logger = this.getLogger(filePath)
        logger.info(message)
    }

    public error(message: string | ErrorLog, filePath: string): void {
        const logger = this.getLogger(filePath)
        logger.error(message)
    }

    public successLog(
        filename: string,
        request: FastifyRequest,
        result: any,
        requestDATE?: string,
        resultDATE?: string
    ): void {
        const successLog = this.createSuccessLog(
            request,
            result,
            requestDATE,
            resultDATE,
            filename
        )
        const logger = this.getLogger(filename)
        logger.info(successLog)
    }

    public errorLog(
        filename: string,
        request: FastifyRequest,
        error: Error,
        requestDATE?: string,
        errorDATE?: string
    ): void {
        const errorLog = this.createErrorLog(
            request,
            error,
            requestDATE,
            errorDATE,
            filename
        )
        const logger = this.getLogger(filename)
        logger.error(errorLog)
    }
}
