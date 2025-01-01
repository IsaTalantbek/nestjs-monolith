import {
    Controller,
    Post,
    Body,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { cookieSettings } from '../../core/keys/cookie.settings'
import { CreateUserDto, LoginUserDto } from './auth.DTO'
import { errorStatic } from 'src/util/error.static'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) reply: any
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

            const { access_token, refresh_token } =
                await this.authService.login(user)
            reply.setCookie('aAuthToken', access_token, cookieSettings)
            reply.setCookie('rAuthToken', refresh_token, cookieSettings)
            return reply
                .status(200)
                .send({ message: 'Успешный логин', token: access_token })
        } catch (error) {
            return errorStatic(reply, error)
        } // Fastify-style response
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() createUserDto: CreateUserDto, @Res() reply: any) {
        try {
            const { login, email, password } = createUserDto // извлекаем данные
            const result = await this.authService.register({
                login,
                email,
                password,
            })
            if (result === 'Пользователь уже существует') {
                return reply.status(400).send({ result })
            }
            return reply.status(200).send({ result })
        } catch (error: any) {
            return errorStatic(reply, error)
        }
    }
}
