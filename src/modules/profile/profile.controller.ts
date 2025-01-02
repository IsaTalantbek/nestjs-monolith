import { Controller, Delete, Get, Req, Res, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { errorStatic } from 'src/util/error.static'
import { JwtGuard } from 'src/common/guards/jwt.guard'
import { cookieClear } from 'src/util/cookie.clear'

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
            errorStatic(error, reply)
            return
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
            errorStatic(error, reply)
            return
        }
    }
}
