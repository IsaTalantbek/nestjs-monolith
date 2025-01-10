import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CookieSettings } from '../../core/keys/cookie.settings'
import { CreateUserDto, LoginUserDto, PreRegisterUserDto } from './auth.dto'
import { JwtAuthorized } from 'src/common/guards/jwt.authorized'

@Controller('auth')
@UseGuards(JwtAuthorized)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cookieSettings: CookieSettings
    ) {}

    @Post('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) reply: any,
        @Req() req: any
    ) {
        try {
            const { login, password } = loginUserDto
            const user = await this.authService.validateUser({
                login,
                password,
            })
            if (!user) {
                return reply
                    .status(401)
                    .send({ message: 'Неправильные данные' })
            }
            const ipPrefix = req.ip.split('.').slice(0, 2).join('.') // Берем первые два октета
            const { newRefreshToken } = await this.authService.login(
                user.id,
                ipPrefix,
                req.ip,
                req.headers['user-agent']
            )
            reply.setCookie(
                this.cookieSettings.refreshTokenName,
                newRefreshToken,
                this.cookieSettings.cookieSettings
            )
            return reply
                .status(200)
                .send({ message: 'Успешный логин', token: newRefreshToken })
        } catch (error) {
            console.error(`Auth-Login: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке войти в аккаунт. Пожалуйста, сообщите нам подробности ',
            })
        }
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res() reply: any) {
        try {
            const { login, email, password } = createUserDto // извлекаем данные
            const result = await this.authService.register({
                login,
                email,
                password,
            })
            if (result === 'Пользователь уже существует') {
                return reply.status(409).send({ result })
            }
            return reply.status(200).send({ result })
        } catch (error: any) {
            console.error(`Auth-Register: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке создать аккаунт. Пожалуйста, сообщите нам подробности ',
            })
        }
    }
    @Post('preregister')
    async preregister(
        @Body() preRegisterUserDto: PreRegisterUserDto,
        @Res() reply: any
    ) {
        try {
            const { login } = preRegisterUserDto
            const check = this.authService.ifUserExist(login)
            if (check) {
                return reply
                    .status(409)
                    .send({ message: 'Пользователь уже существует' })
            }
            return reply.status(200).send({ message: 'Логин не занят' })
        } catch (error: any) {
            console.error(`Auth-PreRegister: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке проверить данные. Пожалуйста, сообщите нам подробности ',
            })
        }
    }
}
