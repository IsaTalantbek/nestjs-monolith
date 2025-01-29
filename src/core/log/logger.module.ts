import { Module } from '@nestjs/common'
import { FileLoggerService } from './file.logger.service.js'
import { ConsoleLoggerService } from './console.logger.service.js'

@Module({
    providers: [FileLoggerService, ConsoleLoggerService],
    exports: [FileLoggerService, ConsoleLoggerService],
})
export class LoggerModule {}
