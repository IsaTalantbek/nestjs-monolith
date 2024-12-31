import { Injectable, NestMiddleware } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    use(req: any, reply: any, next: any) {
        const token = req.cookies?.aAuthToken
        console.log(token)
        // Если токен отсутствует, пропускаем валидацию
        if (!token) {
            return next()
        }
        try {
            console.log(jwt)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Если токен валидный, добавляем данные о пользователе в запрос
            req.user = decoded
            console.log(decoded)
        } catch (error) {
            // Если токен невалиден или истёк — удаляем куки
            return reply.clearCookie('aAuthToken')
        }

        // Переход к следующему мидлвару или контроллеру
        return next()
    }
}
