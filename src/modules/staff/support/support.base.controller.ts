import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SupportBodyDTO } from './sample/support.dto.js'
import { SupportService } from './support.service.js'
import { Log } from '../../../common/decorators/logger.decorator.js'

@Log()
@Controller('support')
export abstract class SupportController_BASE {
    constructor(protected readonly service: SupportService) {}

    @Post()
    async writeSupport_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Body() textDTO: SupportBodyDTO
    ) {
        return await this.writeSupport(reply, req, textDTO)
    }
    @Get(':fileOption')
    async readSupport_BASE(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Param('fileOption') fileOption: string
    ) {
        return await this.readSupport(reply, req, fileOption)
    }
    @Delete(':fileOption')
    async clearSupport_BASE(
        @Param('fileOption') fileOption: string,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        return await this.clearSupport(reply, req, fileOption)
    }
    protected abstract writeSupport(
        reply: FastifyReply,
        req: FastifyRequest,
        textDTO: SupportBodyDTO
    ): Promise<string>
    protected abstract readSupport(
        reply: FastifyReply,
        req: FastifyRequest,
        fileOption: string
    ): Promise<string>
    protected abstract clearSupport(
        reply: FastifyReply,
        req: FastifyRequest,
        fileOption: string
    ): Promise<string>
}
