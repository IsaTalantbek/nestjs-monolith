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
import {
    GivePrivacyQueryDTO,
    UpdatePrivacyBodyDTO,
} from './sample/privacy.dto.js'
import { Log } from '../../../common/decorators/logger.decorator.js'

@Log()
@Controller('profile/privacy')
@UseGuards(SessionGuard)
export abstract class PrivacyController_BASE {
    @Get()
    protected async givePrivacy_BASE(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
        @Query() givePrivacyDTO: GivePrivacyQueryDTO
    ) {
        throw new Error('hello')
        return await this.givePrivacy(reply, req, givePrivacyDTO)
    }
    @Put()
    protected async updatePrivacy_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Body() updatePrivacyDTO: UpdatePrivacyBodyDTO
    ) {
        return await this.updatePrivacy(reply, req, updatePrivacyDTO)
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
