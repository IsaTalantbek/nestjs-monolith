import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { CookieSettings } from '../../core/keys/cookie.settings.js'
import { CreateUserDto, LoginUserDto, PreRegisterUserDto } from './auth.dto.js'
import { JwtAuthorized } from '../../common/guards/jwt/jwt.authorized.js'
import { IpAdressGuard } from '../../common/guards/block/block.guard.js'
import { IpAdressBlockManager } from '../../common/util/block.manager.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { errorStatic } from '../../common/util/error.static.js'

@Controller('auth')
@UseGuards(IpAdressGuard)
@UseGuards(JwtAuthorized)
export class AuthController {
    constructor(
        private readonly auth: AuthService,
        private readonly cookie: CookieSettings,
        private readonly block: IpAdressBlockManager
    ) {}

    @Post('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) reply: FastifyReply,
        @Req() req: FastifyRequest
    ) {
        try {
            const { login, password } = loginUserDto
            const user = await this.auth.validateUser({
                login,
                password,
            })
            if (!user) {
                return reply
                    .status(401)
                    .send({ message: 'Неправильные данные' })
            }
            const ipPrefix = req.ip.split('.').slice(0, 2).join('.') // Берем первые два октета
            const { newRefreshToken } = await this.auth.login(
                user.id,
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
            errorStatic(error, reply, 'LOGIN-AUTH', 'входа в аккаунт')
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
            const { login, email, password } = createUserDto // извлекаем данные
            const headers = req.headers['user-agent']
            const result = await this.auth.register({
                login,
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
            const { login } = preRegisterUserDto
            const check = this.auth.ifUserExist(login)
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
