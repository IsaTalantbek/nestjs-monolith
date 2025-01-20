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
import { FastifyReply, FastifyRequest } from 'fastify'
import { SessionGuard } from '../../../common/guards/session/session.guard.js'
import { errorStatic } from '../../../core/util/error.static.js'
import {
    GivePrivacyQueryDTO,
    UpdatePrivacyBodyDTO,
} from './sample/privacy.dto.js'

@Controller('profile/privacy')
@UseGuards(SessionGuard)
export abstract class PrivacyController_BASE {
    @Get()
    protected async givePrivacy_BASE(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
        @Query() givePrivacyDTO: GivePrivacyQueryDTO
    ) {
        try {
            return await this.givePrivacy(reply, req, givePrivacyDTO)
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
    protected async updatePrivacy_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Body() updatePrivacyDTO: UpdatePrivacyBodyDTO
    ) {
        try {
            return await this.updatePrivacy(reply, req, updatePrivacyDTO)
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
    protected abstract givePrivacy(
        reply: FastifyReply,
        req: FastifyRequest,
        givePrivacyDTO: GivePrivacyQueryDTO
    )
    protected abstract updatePrivacy(
        reply: FastifyReply,
        req: FastifyRequest,
        updatePrivacyDTO: UpdatePrivacyBodyDTO
    )
}
