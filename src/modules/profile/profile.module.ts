import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt' // Импортируем JwtModule
import { JwtService } from '@nestjs/jwt'
import { ProfileController } from './profile.controller'
import { jwtGuard } from 'src/common/guards/jwt.guard'
import { PrismaService } from 'src/core/database/prisma.service'
import { ProfileService } from './profile.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule], // Обязательно указываем, что мы используем ConfigModule
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'), // Получаем секрет из конфигурации
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    controllers: [ProfileController], // Здесь ваш контроллер
    providers: [jwtGuard, PrismaService, ProfileService], // Здесь ваш гвард
})
export class ProfileModule {}
