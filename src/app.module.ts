import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Modules } from './modules/modules.module.js'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { BasePackModule } from './base.pack.module.js'
import { AppInterceptor } from './core/app.interceptor.js'

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
            useClass: AppInterceptor,
        },
    ],
})
export class AppModule {}
