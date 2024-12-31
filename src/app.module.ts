import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { profileModule } from './modules/profile/profile.module'
import { JwtMiddleware } from './common/middleware/jwt.middleware'
import { Logger } from '@nestjs/common'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        profileModule,
    ],
})
export class AppModule implements NestModule {
    private readonly logger = new Logger(AppModule.name)
    configure(consumer: MiddlewareConsumer) {
        this.logger.log('APPMODULE')
        consumer
            .apply(JwtMiddleware) // Регистрация мидлвара
            .forRoutes('*') // Применить ко всем маршрутам
    }
}
