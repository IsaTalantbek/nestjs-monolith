import {
    Controller,
    Get,
    Param,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { JwtGuard } from 'src/common/guards/jwt.guard'
import { cookieClear } from 'src/common/util/cookie.clear'
import { JwtCheck } from 'src/common/guards/jwt.check'
import { ParamUuidPipe } from 'src/common/pipes/paramUUID.pipe'

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
    @UseGuards(JwtGuard)
    @Get()
    async profile(@Res() reply: any, @Req() req: any) {
        try {
            const userId = req.user?.userId

            const result = await this.profileService.profile(userId)
            return reply.status(200).send(result)
        } catch (error: any) {
            console.error(`Profile-Give: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при получении данных профиля. Пожалуйста, сообщите нам подробности ',
            })
        }
    }
    @UseGuards(JwtGuard)
    @Get('logout')
    async logout(@Res() reply: any, @Req() req: any) {
        try {
            const userId = req.user?.userId
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
            console.error(`Profile-Logout: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке выйти из аккаунта. Пожалуйста, сообщите нам подробности ',
            })
        }
    }
    @UseGuards(JwtCheck)
    @UsePipes(ParamUuidPipe)
    @Get(':profileId')
    async userProfile(
        @Param('profileId') userProfileId: string,
        @Res() reply: any,
        @Req() req: any
    ) {
        try {
            const userId = req.user?.userId
            const result = await this.profileService.userProfile(
                userProfileId,
                userId
            )
            return reply.status(200).send(result)
        } catch (error) {
            console.error(`Profile-UserProfile: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке получения данных профиля. Пожалуйста, сообщите нам подробности',
            })
        }
    }
}
