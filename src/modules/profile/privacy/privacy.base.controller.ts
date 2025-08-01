import { Body, Controller, Get, Put, Query, Req, Res } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
    GivePrivacyQueryDTO,
    UpdatePrivacyBodyDTO,
} from './sample/privacy.dto.js'
import { PrivacyService } from './privacy.service.js'

@Controller('profile/privacy')
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
