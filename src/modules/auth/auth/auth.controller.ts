import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { CookieService } from '../../../core/keys/cookie/cookie.service.js'
import { CreateUserDto, loginUserDto, PreRegisterUserDto } from './auth.dto.js'
import { SessionAuthorized } from '../../../common/guards/session/session.authorized.js'
import { IpAdressGuard } from '../../../common/guards/block/block.guard.js'
import { IpAdressBlockService } from '../../../core/util/block/block.service.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Log } from '../../../common/decorators/logger.decorator.js'

@Log()
@Controller('auth')
@UseGuards(IpAdressGuard)
@UseGuards(SessionAuthorized)
export class AuthController {
    constructor(
        private readonly auth: AuthService,
        private readonly cookie: CookieService,
        private readonly block: IpAdressBlockService
    ) {}

    @Post('login')
    async login(
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest,
        @Body() loginUserDto: loginUserDto
    ) {
        try {
            const { slug, password } = loginUserDto
            const userId = await this.auth.validateUser({
                slug,
                password,
            })
            if (!userId) {
                return reply
                    .status(401)
                    .send({ message: 'Неправильные данные' })
            }
            const ipPrefix = req.ip.split('.').slice(0, 2).join('.') // Берем первые два октета
            const { newRefreshToken } = await this.auth.login(
                userId,
                ipPrefix,
                req.ip,
                req.headers['user-agent']
            )
            this.cookie.setCookie(reply, newRefreshToken, 'r')
            return reply
                .status(200)
                .send({ message: 'Успешный логин', token: newRefreshToken })
        } finally {
            this.block.unlock(req.ip)
        }
    }

    @Post('register')
    async register(
        @Body() createUserDto: CreateUserDto,
        @Res() reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            const { slug, email, password } = createUserDto // извлекаем данные
            const headers = req.headers['user-agent']
            const result = await this.auth.register({
                slug,
                email,
                password,
                headers,
            })
            if (result === 'Пользователь уже существует') {
                return reply.status(409).send({ message: result })
            }
            return reply.status(200).send(result)
        } finally {
            this.block.unlock(req.ip)
        }
    }
    @Post('preregister')
    async preregister(
        @Body() preRegisterUserDto: PreRegisterUserDto,
        @Req() req: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        try {
            const { slug } = preRegisterUserDto
            const check = await this.auth.ifUserExist(slug)
            if (check) {
                return reply
                    .status(409)
                    .send({ message: 'Пользователь уже существует' })
            }
            return reply.status(200).send({ message: 'Логин не занят' })
        } finally {
            this.block.unlock(req.ip)
        }
    }
}
