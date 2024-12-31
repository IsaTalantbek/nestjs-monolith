// jwt.util.ts
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'

// Здесь функция будет принимать ConfigService как аргумент
export const jwtCreate = (payload, configService: ConfigService) => {
    const secretKey = configService.get<string>('JWT_SECRET') // Получаем секретный ключ
    return jwt.sign(payload, secretKey, {
        expiresIn: '1h', // время жизни токена
    })
}
