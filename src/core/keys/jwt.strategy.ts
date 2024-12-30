import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JwtStrategy') {
    private readonly logger = new Logger(JwtStrategy.name)

    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                    console.log(request.cookies)
                    const token = request?.cookies?.aAuthToken // Извлекаем токен из cookies
                    console.log('Extracted Token:', token) // Логирование токена
                    return token
                },
            ]),
            ignoreExpiration: false, // Не игнорировать срок действия токена
            secretOrKey: configService.get('JWT_SECRET'), // Секретный ключ для проверки токена
        })
    }

    async validate(payload: any) {
        const userId = parseInt(payload.userId, 10)
        if (isNaN(userId)) {
            console.error(userId, payload)
        }
        return { userId: userId }
    }
}
