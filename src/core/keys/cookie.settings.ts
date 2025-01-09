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
}
