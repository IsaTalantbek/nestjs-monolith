import { Module } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { ConfigModule } from '@nestjs/config'
import { Modules } from './modules/modules.module.js'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { BasePackModule } from './base.pack.module.js'
import { LoggerInterceptor } from './core/log.interceptor.js'
import { SessionGuard } from './common/guards/session/session.guard.index.js'
import { LoggerModule } from 'nestjs-pino'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000,
                limit: 3,
            },
            {
                name: 'medium',
                ttl: 10000,
                limit: 20,
            },
            {
                name: 'long',
                ttl: 60000,
                limit: 100,
            },
        ]),
        LoggerModule.forRoot({
            pinoHttp: {
                level: 'warn', // Логирует только warn и выше (убирает debug/info)
                serializers: {
                    req(req) {
                        return { method: req.method, url: req.url } // Оставляет только метод и URL запроса
                    },
                    res(res) {
                        return { statusCode: res.statusCode }
                    },
                },
            },
        }),
        Modules,
        BasePackModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
