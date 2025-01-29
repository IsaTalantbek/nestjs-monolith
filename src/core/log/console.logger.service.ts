import { Injectable } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'

@Injectable()
export class ConsoleLoggerService {
    constructor(private readonly logger: PinoLogger) {}

    log(message: JSON | object): void {
        this.logger.info(message)
    }

    error(message: JSON | object): void {
        this.logger.error(message)
    }
}
