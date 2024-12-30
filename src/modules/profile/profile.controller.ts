import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ProfileService } from './profile.service'

@Controller('profile')
@UseGuards(AuthGuard('JwtStrategy'))
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
    @Get()
    async getProtectedResource(@Res() reply: any, @Req() req: any) {
        try {
            // Попытка получить профиль с помощью ProfileService
            const userId = req.user.userId // Получаем userId из объекта запроса

            if (!userId) {
                return reply.status(200).send('Упс, обновите страницу!')
            }

            const result = await this.profileService.profile(userId)
            console.log(result)
            reply.status(200).send(result)
        } catch (error: any) {
            // Логируем ошибку для сервера
            console.error(error)

            // Отправляем ответ с кодом 500 и ошибкой
            return reply.status(500).send({
                message: 'Ошибка при попытке загрузки профиля',
                error: error.message || error,
            })
        }
    }
}
