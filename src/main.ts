import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify'
import cookie from '@fastify/cookie'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
    // Создаем приложение с использованием Fastify
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    )

    // Получаем ConfigService из контейнера зависимостей NestJS
    const configService = app.get(ConfigService)

    // Получаем секрет из конфигурации (переменные окружения)
    const jwtSecret = configService.get<string>('JWT_SECRET') // например, из .env

    // Регистрация cookie с конфигурацией
    await app.register(cookie, {
        secret: jwtSecret, // используем секрет, полученный из конфигурации
    })

    // Запуск сервера на Fastify
    await app.listen(
        configService.get<number>('PORT') || 3000,
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
