import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { JwtAuthSettings } from './jwt.auth.settings'

@Injectable()
export class JwtService {
    constructor(private readonly jwtAuthSettings: JwtAuthSettings) {}

    generateAccessToken(user): any {
        const data = this.accessData(user)

        return {
            newAccessToken: jwt.sign(
                data,
                this.jwtAuthSettings.accessSecret,
                this.jwtAuthSettings.accessExpire
            ),
            data,
        }
    }

    generateRefreshToken(user): any {
        const data = this.refreshData(user)

        return {
            newRefreshToken: jwt.sign(
                data,
                this.jwtAuthSettings.refreshSecret,
                this.jwtAuthSettings.refreshExpire
            ),
            data,
        }
    }

    verifyAccessToken(token: string): any {
        try {
            return jwt.verify(token, this.jwtAuthSettings.accessSecret)
        } catch (error) {
            return null
        }
    }

    verifyRefreshToken(token: string): any {
        try {
            return jwt.verify(token, this.jwtAuthSettings.refreshSecret)
        } catch (error) {
            return null
        }
    }
    accessData(user) {
        return {
            accountId: user.id,
            accountRole: user.accountRole,
        }
    }

    refreshData(user) {
        return {
            accountId: user.id,
        }
    }
}
