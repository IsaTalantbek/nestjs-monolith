import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Modules } from './modules/modules.module.js'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from './common/log/logger.interceptor.js'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        Modules,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
