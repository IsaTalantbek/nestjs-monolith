import { Global, Module } from '@nestjs/common'
import { LoggerModule } from './core/log/logger.module.js'
import { SessionGuardModule } from './common/guards/session/service/session.guard.module.js'

@Global()
@Module({
    imports: [LoggerModule, SessionGuardModule],
    exports: [LoggerModule, SessionGuardModule],
})
export class BasePackModule {}
