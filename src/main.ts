import { NestFactory } from '@nestjs/core'
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import fastifyCookieParser from '@fastify/cookie'
import { AppModule } from './app.module.js'

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

    // Получаем ConfigService из контейнера зависимостей NestJS
    const configService = app.get(ConfigService)

    //Куки парсер
    await app.register(fastifyCookieParser)

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // Чтобы `class-transformer` мог преобразовать типы
            whitelist: true, // Удаляет поля, которые не указаны в DTO
            forbidNonWhitelisted: true, // Если есть лишние поля — выбросить ошибку
        })
    )
    // Запуск сервера на Fastify
    await app.listen(
        configService.get<string>('APP_PORT'),
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
