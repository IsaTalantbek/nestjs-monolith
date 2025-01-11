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
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard'
import { JwtCheck } from 'src/common/guards/jwt/jwt.check'
import { ParamUuidPipe } from 'src/common/pipes/paramUUID.pipe'

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
    @Get()
    @UseGuards(JwtGuard)
    async profile(@Res() reply: any, @Req() req: any) {
        try {
            const accountId = req.user?.accountId
            const result = await this.profileService.profile(accountId)
            return reply.status(200).send(result)
        } catch (error: any) {
            console.error(`Profile-Give: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при получении данных профиля. Пожалуйста, сообщите нам подробности ',
            })
        }
    }

    @UseGuards(JwtCheck)
    @UsePipes(ParamUuidPipe)
    @Get(':profileId')
    async userProfile(
        @Param('profileId') profileId: string,
        @Res() reply: any,
        @Req() req: any
    ) {
        try {
            const accountId = req.user?.accountId
            const result = await this.profileService.userProfile(
                profileId,
                accountId
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
