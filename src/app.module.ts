import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Modules } from './modules/modules.module.js'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from './common/log/logger.interceptor.js'
import { BasePackModule } from './base.pack.module.js'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        Modules,
        BasePackModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
