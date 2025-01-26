import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Modules } from './modules/modules.module.js'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { BasePackModule } from './base.pack.module.js'
import { AppInterceptor } from './core/app.interceptor.js'
import { SessionGuard } from './common/guards/session/session.base.guard.js'
import { SessionGuardModule } from './common/guards/session/session.guards.module.js'

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
        { provide: APP_GUARD, useClass: SessionGuard },
    ],
})
export class AppModule {}
