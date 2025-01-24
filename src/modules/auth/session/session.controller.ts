import {
    Controller,
    Get,
    Req,
    Res,
    UseGuards,
    Delete,
    Param,
    Put,
} from '@nestjs/common'
import { SessionService } from '../../../core/session/session.service.js'
import { CookieService } from '../../../core/keys/cookie/cookie.service.js'
import { SessionGuard } from '../../../common/guards/session/session.guard.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Log } from '../../../common/decorators/logger.decorator.js'
import { UUID } from 'crypto'

@Log()
@Controller('session')
@UseGuards(SessionGuard)
export class SessionController {
    constructor(
        private readonly session: SessionService,
        private readonly cookie: CookieService
    ) {}
    @Get()
    async getSessions(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const accountId = req.user.accountId

        const session = await this.session.getSessions(accountId)

        return reply.status(200).send(session) // Вернёт данные из сессии
    }

    @Delete('logout/all')
    async logoutAll(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const accountId = req.user.accountId
        const sessionId = req.user.sessionId
        await this.session.deleteAllSessionsForUser(
            accountId,
            req.headers['user-agent'],
            sessionId
        )

        this.cookie.clearCookie(
            reply,
            this.cookie.accessTokenName,
            this.cookie.refreshTokenName
        )
        return reply.status(200).send({ message: 'Вы завершили все сессии' })
    }

    @Delete('logout/:sessionId?')
    async logout(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
        @Param('sessionId') sessionId?: UUID
    ) {
        const accountId = req.user.accountId
        const thisSession: UUID = req.user.sessionId
        if (!sessionId) {
            sessionId = thisSession
        }
        await this.session.deleteSession(
            accountId,
            sessionId,
            req.headers['user-agent'],
            thisSession
        )
        if (sessionId === thisSession) {
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
    @Put(':userSessionId')
    async giveSuperUser(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
        @Param('userSessionId') userSessionId?: UUID
    ) {
        const sessionId: UUID = req.user.sessionId
        const accountId: UUID = req.user.accountId
        const result = await this.session.giveSuperUser(
            accountId,
            userSessionId,
            sessionId,
            req.headers['user-agent']
        )
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply
            .status(200)
            .send({ message: 'Вы успешно передали роль суперюзера' })
    }
}
