import { Injectable } from '@nestjs/common'

@Injectable()
export class CookieSettings {
    get cookieSettings() {
        return {
            httpOnly: true,
            secure: true,
            maxAge: 60400,
            sameSite: 'strict',
            path: '/',
        }
    }
    get accessTokenName() {
        return 'aAuthToken'
    }
    get refreshTokenName() {
        return 'rAuthToken'
    }
}
