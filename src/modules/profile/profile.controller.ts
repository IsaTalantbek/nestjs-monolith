import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ProfileService } from './profile.service'
import { errorStatic } from 'src/util/error.static'
import { jwtGuard } from 'src/common/guards/jwt.guard'

@Controller('a/profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
    @Get()
    @UseGuards(jwtGuard)
    async getProtectedResource(@Res() reply: any, @Req() req: any) {
        try {
            // Попытка получить профиль с помощью ProfileService
            const userId = req.user?.userId // Получаем userId из объекта запроса

            if (!userId) {
                return reply.status(500).send('Упс, обновите страницу!')
            }

            const result = await this.profileService.profile(userId)
            console.log(result)
            return reply.status(200).send(result)
        } catch (error: any) {
            return errorStatic(error, reply)
        }
    }
}
