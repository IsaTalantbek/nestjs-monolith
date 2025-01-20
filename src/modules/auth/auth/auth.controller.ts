import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { CookieSettings } from '../../../core/keys/cookie/cookie.settings.js'
import { CreateUserDto, loginUserDto, PreRegisterUserDto } from './auth.dto.js'
import { SessionAuthorized } from '../../../common/guards/session/session.authorized.js'
import { IpAdressGuard } from '../../../common/guards/block/block.guard.js'
import { IpAdressBlockManager } from '../../../core/util/block.manager.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { errorStatic } from '../../../core/util/error.static.js'

@Controller('auth')
@UseGuards(IpAdressGuard)
@UseGuards(SessionAuthorized)
export class AuthController {
    constructor(
        private readonly auth: AuthService,
        private readonly cookie: CookieSettings,
        private readonly block: IpAdressBlockManager
    ) {}

    @Post('login')
    async login(
        @Body() loginUserDto: loginUserDto,
        @Res({ passthrough: true }) reply: FastifyReply,
        @Req() req: FastifyRequest
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
        } catch (error) {
            this.block.unlock(req.ip)
            errorStatic(error, reply, 'slug-AUTH', 'входа в аккаунт')
            return
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
        } catch (error) {
            this.block.unlock(req.ip)
            errorStatic(error, reply, 'REGISTER-AUTH', 'регистрации')
            return
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
        } catch (error) {
            this.block.unlock(req.ip)
            errorStatic(
                error,
                reply,
                'PREREGISTER-AUTH',
                'проверки перед регистрацией'
            )
            return
        } finally {
            this.block.unlock(req.ip)
        }
    }
}
