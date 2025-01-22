import { Injectable } from '@nestjs/common'
import jwt from 'jsonwebtoken'
import { JwtAuthSettings } from './jwt.auth.settings.js'
import { UUID } from 'crypto'

export interface JwtAccessTokenData {
    sessionId: UUID
    accountId: UUID
    iat: number
    exp: number
}
export interface JwtRefreshTokenData {
    sessionId: UUID
    iat: number
    exp: number
}
export interface NewAccessToken {
    newAccessToken: string
}
export interface NewRefreshToken {
    newRefreshToken: string
}

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtAuthSettings: JwtAuthSettings) {}

    public generateAccessToken(
        accountId: UUID,
        sessionId: UUID
    ): NewAccessToken {
        return {
            newAccessToken: jwt.sign(
                { accountId: accountId, sessionId: sessionId },
                this.jwtAuthSettings.accessSecret,
                this.jwtAuthSettings.accessExpire
            ),
        }
    }

    public generateRefreshToken(sessionId: UUID): NewRefreshToken {
        return {
            newRefreshToken: jwt.sign(
                { sessionId: sessionId },
                this.jwtAuthSettings.refreshSecret,
                this.jwtAuthSettings.refreshExpire
            ),
        }
    }

    public verifyAccessToken(token: string): JwtAccessTokenData | null {
        try {
            const decoded = jwt.verify(token, this.jwtAuthSettings.accessSecret)

            // Приводим результат к интерфейсу JwtAccessTokenData
            if (
                typeof decoded === 'object' &&
                decoded !== null &&
                'sessionId' in decoded
            ) {
                return decoded as JwtAccessTokenData
            }
            return null // Если структура не соответствует JwtAccessTokenData
        } catch (error) {
            return null // Токен недействителен
        }
    }

    public verifyRefreshToken(token: string): JwtRefreshTokenData | null {
        try {
            const decoded = jwt.verify(
                token,
                this.jwtAuthSettings.refreshSecret
            )

            // Приводим результат к интерфейсу JwtAccessTokenData
            if (
                typeof decoded === 'object' &&
                decoded !== null &&
                'sessionId' in decoded
            ) {
                return decoded as JwtRefreshTokenData
            }
            return null // Если структура не соответствует JwtAccessTokenData
        } catch (error) {
            return null // Токен недействителен
        }
    }
}
