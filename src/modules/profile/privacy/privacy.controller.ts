import {
    Body,
    Controller,
    Get,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'

import { JwtGuard } from 'src/common/guards/jwt/jwt.guard'
import { PrivacyService } from './privacy.service'
import { GivePrivacyQueryDto, UpdatePrivacyBodyDto } from './privacy.dto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { errorStatic } from 'src/common/util/error.static'

@Controller('profile/privacy')
@UseGuards(JwtGuard)
export class PrivacyController {
    constructor(private readonly privacy: PrivacyService) {}
    @Get()
    async getPrivacy(
        @Query() profileIdDto: GivePrivacyQueryDto,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const accountId = req.user.accountId
            const { profileId } = profileIdDto
            const result = await this.privacy.getPrivacy(accountId, profileId)
            if (!result) {
                return reply.status(400).send({
                    message: 'Неправильные данные, или недостаточно данных',
                })
            }
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(
                error,
                reply,
                'GET-PRIVACY',
                'загрузки настроек приватности'
            )
            return
        }
    }
    @Put()
    async updatePrivacy(
        @Body() updatePrivacyDto: UpdatePrivacyBodyDto,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            const accountId = req.user.accountId
            const { profileId, value, update } = updatePrivacyDto
            const result = await this.privacy.updatePrivacy(
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
            errorStatic(
                error,
                reply,
                'UPDATE-PRIVACY',
                'обновить настройки приватности'
            )
            return
        }
    }
}
