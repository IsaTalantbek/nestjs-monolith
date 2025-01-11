import {
    Controller,
    Post,
    Get,
    Req,
    Res,
    UseGuards,
    Delete,
    Param,
    Put,
} from '@nestjs/common'
import { SessionService } from './session.service'
import { CookieSettings } from 'src/core/keys/cookie.settings'
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller('session')
@UseGuards(JwtGuard)
export class SessionController {
    constructor(
        private readonly sessionService: SessionService,
        private readonly cookie: CookieSettings
    ) {}
    @Get()
    async getSessions(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        try {
            const accountId = req.user.accountId

            const session = await this.sessionService.getSessions(accountId)

            return reply.status(200).send(session) // Вернёт данные из сессии
        } catch (error) {
            console.error(`Get-Session: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке получить существующие сессии. Пожалуйста, сообщите нам подробности',
            })
        }
    }

    @Delete('logout')
    async logoutAll(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        try {
            const accountId = req.user.accountId
            const sessionId = req.user.sessionId
            await this.sessionService.deleteAllSessionsForUser(
                accountId,
                req.headers['user-agent'],
                sessionId
            )

            this.cookie.clearCookie(
                reply,
                this.cookie.accessTokenName,
                this.cookie.refreshTokenName
            )
            return reply
                .status(200)
                .send({ message: 'Вы завершили все сессии' })
        } catch (error) {
            console.error(`Logount-All-Session: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке удалить существующие сессии. Пожалуйста, сообщите нам подробности',
            })
        }
    }

    @Post('logout/:sessionId?')
    async logout(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
        @Param('sessionId') sessionId?: string
    ) {
        try {
            const accountId = req.user.accountId
            const thisSession = req.user.sessionId
            if (!sessionId) {
                sessionId = thisSession
            }
            await this.sessionService.deleteSession(
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
        } catch (error) {
            console.error(`Logout-Session: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при удалить существующую сессию. Пожалуйста, сообщите нам подробности',
            })
        }
    }
    @Put(':userSessionId')
    async giveSuperUser(
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply,
        @Param('userSessionId') userSessionId?: string
    ) {
        try {
            const sessionId = req.user.sessionId
            const accountId = req.user.accountId
            const result = await this.sessionService.giveSuperUser(
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
        } catch (error) {
            console.error(`Update-SuperUser-Session: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке передать роль суперюзера. Пожалуйста, сообщите нам подробности',
            })
        }
    }
}
