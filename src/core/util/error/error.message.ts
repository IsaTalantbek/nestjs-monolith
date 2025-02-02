import { HttpException, HttpStatus } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

export class CriticalErrorException extends HttpException {
    constructor(
        req: FastifyRequest,
        error?: any,
        message?: string,
        full?: boolean
    ) {
        const date = new Date().toISOString()

        if (error) {
            console.error(error)
            console.error(date)
        }

        super(
            {
                message:
                    full === true
                        ? message
                        : message
                          ? `Произошла критическая ошибка при попытке ${message}. Пожалуйста, сообщите нам что случилось, если вам это помешало`
                          : 'Произошла критическая ошибка при попытке получить нужные данные. Пожалуйста, сообщите нам что случилось, если вам это помешало',
                path: req.url,
                method: req.method,
                date: date,
            },
            HttpStatus.INTERNAL_SERVER_ERROR
        )
    }
}
