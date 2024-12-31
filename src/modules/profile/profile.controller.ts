import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ProfileService } from './profile.service'
import { errorStatic } from 'src/util/error.static'

@Controller('a/profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
    @Get()
    async getProtectedResource(@Res() reply: any, @Req() req: any) {
        try {
            console.log(req.user)
            const userId = req.user.userId // Получаем userId из объекта запроса

            if (!userId) {
                return reply.status(200).send('Упс, обновите страницу!')
            }

            const result = await this.profileService.profile(userId)
            console.log(result)
            return reply.status(200).send(result)
        } catch (error: any) {
            console.log(error)
            return error
        }
    }
}
