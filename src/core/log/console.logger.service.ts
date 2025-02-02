import { Injectable } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'

@Injectable()
export class ConsoleLoggerService {
    constructor(private readonly logger: PinoLogger) {}

    public log(message: JSON | object): void {
        this.logger.info(message)
    }

    public error(message: JSON | object): void {
        this.logger.error(message)
    }
}
