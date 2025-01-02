import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { jwtAccesExpire, jwtRefreshExpire } from './jwt.settings'

@Injectable()
export class JwtTokenService {
    private readonly accessSecret: string
    private readonly refreshSecret: string
    private readonly accessExpire = jwtAccesExpire
    private readonly refreshExpire = jwtRefreshExpire

    constructor(private readonly configService: ConfigService) {
        this.accessSecret = this.configService.get<string>('JWT_SECRET')
        this.refreshSecret =
            this.configService.get<string>('JWT_REFRESH_SECRET')
    }

    generateAccessToken(payload: any): string {
        return jwt.sign(payload, this.accessSecret, this.accessExpire)
    }

    generateRefreshToken(payload: any): string {
        return jwt.sign(payload, this.refreshSecret, this.refreshExpire)
    }

    verifyAccessToken(token: string): any {
        try {
            return jwt.verify(token, this.accessSecret)
        } catch (error) {
            return null
        }
    }

    verifyRefreshToken(token: string): any {
        try {
            return jwt.verify(token, this.refreshSecret)
        } catch (error) {
            return null
        }
    }
}
