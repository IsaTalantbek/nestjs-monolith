import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify'
import cookie from '@fastify/cookie'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import RateLimit from '@fastify/rate-limit'
import session from '@fastify/session'
import * as passport from 'passport'
import { CookieSettings } from './core/keys/cookie.settings.js'

async function bootstrap() {
    // Создаем приложение с использованием Fastify
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    )

    // app.enableCors({
    //   origin: 'http://example.com', // Замените на ваш клиентский домен
    //   credentials: true,
    // });

    app.register(RateLimit, {
        max: 80, // максимальное количество запросов
        timeWindow: '1 minute', // за одну минуту
        keyGenerator: (req) => req.ip, // Идентификатор пользователя (по IP)
    })
    // Получаем ConfigService из контейнера зависимостей NestJS
    const configService = app.get(ConfigService)
    //const cookieSettings = app.get(CookieSettings)
    await app.register(cookie)

    //await app.register(session, {
    //    secret: configService.get<string>('SESSION_SECRET'),
    //    cookie: cookieSettings.cookieSettings,
    //    saveUninitialized: false,
    //})

    //app.use(passport.initialize())
    //app.use(passport.session())

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Удаляет поля, которые не указаны в DTO
            forbidNonWhitelisted: true, // Если есть лишние поля — выбросить ошибку
        })
    )
    // Запуск сервера на Fastify
    await app.listen(
        configService.get<number>('PORT'),
        '127.0.0.1',
        (err, address) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
            console.log(`Server listening at ${address}`)
        }
    )
}

bootstrap()
