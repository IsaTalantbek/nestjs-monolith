import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Modules } from './modules/modules.module.js'
import { AuthPackModule } from './auth.pack.module.js'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        Modules,
    ],
})
export class AppModule {}
