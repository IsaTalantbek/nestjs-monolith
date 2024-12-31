import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JwtStrategy') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                    const token = request?.cookies?.aAuthToken // Извлекаем токен из cookies
                    return token
                },
            ]),
            ignoreExpiration: false, // Не игнорировать срок действия токена
            secretOrKey: configService.get('JWT_SECRET'), // Секретный ключ для проверки токена
        })
    }

    async validate(payload: any) {
        return { userId: payload.userId }
    }
}
