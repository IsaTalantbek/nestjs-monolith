import { Global, Module } from '@nestjs/common'
import { LoggerModule } from '@core/log'
import { SessionGuardModule } from '@guard/session'

@Global()
@Module({
    imports: [LoggerModule, SessionGuardModule],
    exports: [LoggerModule, SessionGuardModule],
})
export class BasePackModule {}
