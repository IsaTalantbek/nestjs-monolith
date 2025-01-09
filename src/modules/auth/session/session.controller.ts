import {
    Controller,
    Post,
    Get,
    Req,
    Res,
    HttpException,
    HttpStatus,
    UseGuards,
    Delete,
    Param,
    UsePipes,
} from '@nestjs/common'
import { SessionService } from './session.service'
import { FastifyRequest, FastifyReply } from 'fastify'
import { CookieSettings } from 'src/core/keys/cookie.settings'
import { JwtGuard } from 'src/common/guards/jwt.guard'
import { clearCookie } from 'src/common/util/cookie.clear'
import { ParamUuidPipe } from 'src/common/pipes/paramUUID.pipe'

@Controller('session')
@UseGuards(JwtGuard)
export class SessionController {
    constructor(
        private readonly sessionService: SessionService,
        private readonly cookie: CookieSettings
    ) {}
    @Get()
    async getSessions(@Req() req: any) {
        const accountId = req.user.accountId

        const session = await this.sessionService.getSessions(accountId)

        return session // Вернёт данные из сессии
    }

    @Delete('logout')
    async logoutAll(@Req() req: any, @Res() reply: any) {
        const accountId = req.user.accountId

        await this.sessionService.deleteAllSessionsForUser(
            accountId,
            req.headers['user-agent']
        )

        this.cookie.clearCookie(
            reply,
            this.cookie.accessTokenName,
            this.cookie.refreshTokenName
        )
        return reply.status(200).send({ message: 'Вы завершили все сессии' })
    }

    @Post('logout/:sessionId?')
    async logout(
        @Req() req: any,
        @Res() reply: FastifyReply,
        @Param('sessionId') sessionId?: string
    ) {
        if (!sessionId) {
            sessionId = req.user.sessionId
        }
        await this.sessionService.deleteSession(
            sessionId,
            req.headers['user-agent']
        )
        if (sessionId === req.user.sessionId) {
            this.cookie.clearCookie(
                reply,
                this.cookie.accessTokenName,
                this.cookie.refreshTokenName
            )
        }
        return reply
            .status(200)
            .send({ message: 'Вы успешно вышли из системы' })
    }
}
