import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { JwtAuthSettings } from './jwt.auth.settings'

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtAuthSettings: JwtAuthSettings) {}

    public generateAccessToken(...data): any {
        return {
            newAccessToken: jwt.sign(
                { data },
                this.jwtAuthSettings.accessSecret,
                this.jwtAuthSettings.accessExpire
            ),
        }
    }

    public generateRefreshToken(data): any {
        return {
            newRefreshToken: jwt.sign(
                { data },
                this.jwtAuthSettings.refreshSecret,
                this.jwtAuthSettings.refreshExpire
            ),
        }
    }

    public verifyAccessToken(token: string): any {
        try {
            return jwt.verify(token, this.jwtAuthSettings.accessSecret)
        } catch (error) {
            return null
        }
    }

    public verifyRefreshToken(token: string): any {
        try {
            return jwt.verify(token, this.jwtAuthSettings.refreshSecret)
        } catch (error) {
            return null
        }
    }
}
