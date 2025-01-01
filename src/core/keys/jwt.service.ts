import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtTokenService {
    private readonly accessSecret: string
    private readonly refreshSecret: string
    private readonly accessExpire = '1h'
    private readonly refreshExpire = '7d'

    constructor(private readonly configService: ConfigService) {
        this.accessSecret = this.configService.get<string>('JWT_SECRET')
        this.refreshSecret =
            this.configService.get<string>('JWT_REFRESH_SECRET')
    }

    generateAccessToken(payload: any): string {
        return jwt.sign(payload, this.accessSecret, {
            expiresIn: this.accessExpire,
        })
    }

    generateRefreshToken(payload: any): string {
        return jwt.sign(payload, this.refreshSecret, {
            expiresIn: this.refreshExpire,
        })
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
