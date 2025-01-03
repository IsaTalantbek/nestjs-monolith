import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { JwtGuard } from 'src/common/guards/jwt.guard'
import { cookieClear } from 'src/common/util/cookie.clear'

@Controller('profile')
@UseGuards(JwtGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
    @Get()
    async userProfile(@Res() reply: any, @Req() req: any) {
        try {
            const userId = req.user?.userId

            const result = await this.profileService.profile(userId)

            return reply.status(200).send(result)
        } catch (error: any) {
            console.error(`Profile-Give-Error: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при получить данные профиля. Пожалуйста, сообщите нам подробности ',
            })
        }
    }
    @Get('logout')
    async logout(@Res() reply: any, @Req() req: any) {
        try {
            const userId = req.user?.vsUserId
            if (userId) {
                cookieClear(reply)
                reply
                    .status(200)
                    .send({ message: 'Успешный выход из аккаунта' })
                return
            }
            console.error(`logout: ${req}`)
            return reply
                .status(500)
                .send({ message: 'Странно, но похоже у вас нет аккаунта' })
        } catch (error) {
            console.error(`Profile-Logout-Error: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке выйти из аккаунта. Пожалуйста, сообщите нам подробности ',
            })
        }
    }
}
