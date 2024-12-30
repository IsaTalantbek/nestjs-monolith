import {
    Controller,
    Request,
    Post,
    UseGuards,
    Get,
    Body,
    Res,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { cookieSettings } from '../../core/keys/cookie.settings'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body, @Res({ passthrough: true }) reply: any) {
        const user = await this.authService.validateUser(
            body.login,
            body.password
        )
        if (!user) {
            reply.status(401).send({ message: 'Неправильные данные' })
            return
        }

        const { access_token } = await this.authService.login(user)
        reply.setCookie('aAuthToken', access_token, cookieSettings)
        return { message: 'Успешный логин', token: access_token } // Fastify-style response
    }

    @Post('register')
    async register(@Body() body) {
        await this.authService.register(body.login, body.password)
        return { message: 'Успешная регистрация' }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }
}
