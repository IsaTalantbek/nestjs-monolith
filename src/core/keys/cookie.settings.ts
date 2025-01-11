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
}
