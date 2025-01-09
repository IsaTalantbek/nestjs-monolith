import {
    Controller,
    Post,
    Get,
    Req,
    Res,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { SessionService } from './session.service'
import { PrismaService } from '../../../core/database/prisma.service'
import { FastifyRequest, FastifyReply } from 'fastify'

@Controller('session')
export class SessionController {
    constructor(
        private readonly sessionService: SessionService,
        private readonly prisma: PrismaService
    ) {}

    @Post('login')
    async login(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const { login, password } = req.body as {
            login: string
            password: string
        }
        const user = await this.sessionService.validateUser(login, password)
        if (!user) {
            return reply.status(500).send('Вы гавноы')
        }
        // Создай сессию
        const sessionJWT = await this.sessionService.createSession(
            user.id,
            {
                role: user.accountRole,
            },
            req.ip,
            req.headers['user-agent']
        )
        // Установи сессионную cookie
        reply
            .setCookie('aAuthSession', sessionJWT, {
                httpOnly: true,
                path: '/',
                secure: false, // true для HTTPS
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'strict',
            })
            .send({ message: 'Logged in' })
    }

    @Post('logout')
    async logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        const sessionId = req.cookies?.SESSION_ID

        if (!sessionId) {
            throw new HttpException(
                'No session ID found',
                HttpStatus.BAD_REQUEST
            )
        }

        // Удаление сессии
        await this.sessionService.deleteSession(sessionId)

        // Удаление cookie
        res.clearCookie('SESSION_ID').send({ message: 'Logged out' })
    }

    @Get('me')
    async getMe(@Req() req: FastifyRequest) {
        const sessionId = req.cookies?.SESSION_ID

        if (!sessionId) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        }

        const session = await this.sessionService.getSession(sessionId)

        if (!session || session.expiresAt < new Date()) {
            throw new HttpException('Session expired', HttpStatus.UNAUTHORIZED)
        }

        return session.data // Вернёт данные из сессии
    }
}
