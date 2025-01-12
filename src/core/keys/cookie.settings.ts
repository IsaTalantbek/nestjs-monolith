import { Injectable } from '@nestjs/common'

@Injectable()
export class CookieSettings {
    get cookieSettings() {
        return {
            httpOnly: true,
            secure: true,
            maxAge: 604800,
            sameSite: 'strict' as 'strict',
            path: '/',
        }
    }

    get accessTokenName() {
        return 'aAuthToken'
    }

    get refreshTokenName() {
        return 'rAuthToken'
    }

    public setCookie = (reply, token, option) => {
        if (option === 'a') {
            return reply.setCookie(
                this.accessTokenName,
                token,
                this.cookieSettings
            )
        } else if (option === 'r') {
            return reply.setCookie(
                this.refreshTokenName,
                token,
                this.cookieSettings
            )
        } else {
            throw new Error('В setcookie выбрана неправильная опция')
        }
    }

    public clearCookie = (reply, ...args) => {
        args.forEach((cookie) => reply.clearCookie(cookie))
    }

    public userData = (data: object) => {
        // Если session — массив объектов
        if (Array.isArray(data)) {
            if (data.length > 0 && typeof data[0] === 'object') {
                return { accountId: data[0]['accountId'] || null }
            }
            throw new Error('Invalid session array structure')
        }

        // Если session — объект
        if (data && typeof data === 'object') {
            const newData = (data as any).data

            // Если есть поле `data` и оно массив строк
            if (
                Array.isArray(newData) &&
                newData.length === 2 &&
                newData.every((item) => typeof item === 'string')
            ) {
                return { accountId: newData[0], sessionId: newData[1] }
            }

            // Если это просто объект с другими свойствами
            const { accountId, id } = data as {
                accountId?: string
                id?: string
            }

            return {
                accountId: accountId || null, // Если есть `accountId`, берем его, иначе используем `id`
                sessionId: id || null, // Берем `sessionId`, если он есть
            }
        }

        // Если данные имеют неизвестный формат
        throw new Error('Invalid session format')
    }
}
