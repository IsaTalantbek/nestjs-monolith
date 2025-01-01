import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ProfileService } from './profile.service'
import { errorStatic } from 'src/util/error.static'
import { JwtGuard } from 'src/common/guards/jwt.guard'
import { VsUserIdDto } from './profile.DTO'

@Controller('a/profile')
@UseGuards(JwtGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
    @Get()
    async userProfile(@Res() reply: any, @Req() req: any) {
        try {
            // Попытка получить профиль с помощью ProfileService
            const userId = req.user?.userId // Получаем userId из объекта запроса

            if (!userId) {
                return reply.status(500).send('У вас нет аккаунта')
            }

            const result = await this.profileService.profile(userId)
            return reply.status(200).send(result)
        } catch (error: any) {
            return errorStatic(error, reply)
        }
    }
    @Post()
    async addBlackList(
        @Body() vsUserIdDto: VsUserIdDto,
        @Res() reply: any,
        @Req() req: any
    ) {
        try {
            const userId = req.user.userId
            if (!userId) {
                return reply
                    .status(500)
                    .send({
                        message:
                            'Зарегистрируйтесь, прежде чем зайти в профиль',
                    })
            }
            const { vsUserId } = vsUserIdDto
            const result = await this.profileService.addToBlackList(
                userId,
                vsUserId
            )
            if (!result) {
                return reply
                    .status(409)
                    .send({ message: 'Пользователь не существует' })
            }
            if (result === 'Нельзя добавить себя в черный список') {
                return reply.status(500).send({ message: result })
            }
            return reply.status(200).send({
                message: 'Пользователь успено добавлен в черный список',
            })
        } catch (error) {
            return errorStatic(error, reply)
        }
    }
}
