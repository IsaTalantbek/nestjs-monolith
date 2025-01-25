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
import { PrivacyService } from './privacy.service.js'

@Log()
@Controller('profile/privacy')
@UseGuards(SessionGuard)
export abstract class PrivacyController_BASE {
    constructor(protected readonly service: PrivacyService) {}

    @Get()
    protected async givePrivacy_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Query() givePrivacyDTO: GivePrivacyQueryDTO
    ) {
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
