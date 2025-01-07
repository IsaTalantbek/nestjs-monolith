import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common'

import { JwtGuard } from 'src/common/guards/jwt.guard'
import { PrivacyService } from './privacy.service'
import { GivePrivacyQueryDto, UpdatePrivacyBodyDto } from './privacy.dto'
import { errorStatic } from 'src/common/util/error.static'

@Controller('profile/privacy')
@UseGuards(JwtGuard)
export class PrivacyController {
    constructor(private readonly privacyService: PrivacyService) {}
    @Get()
    async getPrivacy(
        @Query() profileIdDto: GivePrivacyQueryDto,
        @Req() req: any,
        @Res() reply: any
    ) {
        try {
            const accountId = req.user.accountId
            const { profileId } = profileIdDto
            const result = await this.privacyService.getPrivacy(
                accountId,
                profileId
            )
            if (!result) {
                return reply.status(400).send({
                    message: 'Неправильные данные, или недостаточно данных',
                })
            }
            return reply.status(200).send(result)
        } catch (error) {
            console.error(`Get-Privacy: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке получить данные о приватности. Пожалуйста, сообщите нам что случилось',
            })
        }
    }
    @Put()
    async updatePrivacy(
        @Body() updatePrivacyDto: UpdatePrivacyBodyDto,
        @Res() reply: any,
        @Req() req: any
    ) {
        try {
            const accountId = req.user.accountId
            const { profileId, value, update } = updatePrivacyDto
            const result = await this.privacyService.updatePrivacy(
                profileId,
                update,
                value,
                accountId
            )
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Изменения успешно сохранены' })
        } catch (error) {
            console.error(`Update-Privacy: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке обновить настройки приватности. Пожалуйста, сообщите нам что случилось',
            })
        }
    }
}
