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

    private getLogger(filename: string): winston.Logger {
        if (!this.loggers[filename]) {
            // Проверяем лимит и очищаем старые логеры
            this.cleanupOldLoggers()

            // Создаём новый логер
            this.loggers[filename] = winston.createLogger({
                level: 'info',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json({ deterministic: false })
                ),
                transports: [
                    new winston.transports.File({ filename: filename }),
                ],
            })
        }
        return this.loggers[filename]
    }

    public log(
        message: string | SuccessLog | ErrorLog,
        filename: string
    ): void {
        const logger: winston.Logger = this.getLogger(filename)
        logger.info(message)
    }

    public error(message: string | ErrorLog, filename: string): void {
        const logger: winston.Logger = this.getLogger(filename)
        logger.error(message)
    }

    public successLog(
        filename: string,
        request: FastifyRequest,
        result: 'secret' | any,
        requestDATE?: string,
        resultDATE?: string
    ): void {
        const successLog: SuccessLog = this.createSuccessLog(
            request,
            result,
            requestDATE,
            resultDATE,
            filename
        )
        const logger: winston.Logger = this.getLogger(filename)
        logger.info(successLog)
    }

    public errorLog(
        filename: string,
        request: FastifyRequest,
        error: Error,
        requestDATE?: string,
        errorDATE?: string
    ): void {
        const errorLog: ErrorLog = this.createErrorLog(
            request,
            error,
            requestDATE,
            errorDATE,
            filename
        )
        const logger: winston.Logger = this.getLogger(filename)
        logger.error(errorLog)
    }
}
