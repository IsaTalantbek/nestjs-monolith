import { Injectable } from '@nestjs/common'
import jwt from 'jsonwebtoken'
import { JwtAuthSettings } from './jwt.auth.settings.js'
import { UUID } from 'crypto'
import { promisify } from 'util'
import {
    JwtAccessTokenData,
    JwtRefreshTokenData,
    NewAccessToken,
    NewRefreshToken,
} from './jwt.auth.interface.js'

@Injectable()
export class JwtAuthService {
    private readonly signAsync: (
        payload: string | object | Buffer,
        secretOrPrivateKey: jwt.Secret,
        options: jwt.SignOptions
    ) => Promise<string>
    private readonly verifyAsync: (
        token: string,
        secretOrPublicKey: jwt.Secret,
        options?: jwt.VerifyOptions
    ) => Promise<any>

    constructor(private readonly jwtAuthSettings: JwtAuthSettings) {
        this.signAsync = promisify(jwt.sign)
        this.verifyAsync = promisify(jwt.verify)
    }

    public async generateAccessToken(
        accountId: UUID,
        sessionId: UUID
    ): Promise<NewAccessToken> {
        return {
            newAccessToken: await this.signAsync(
                { accountId: accountId, sessionId: sessionId },
                this.jwtAuthSettings.accessSecret,
                this.jwtAuthSettings.accessExpire
            ),
        }
    }

    public async generateRefreshToken(
        sessionId: UUID
    ): Promise<NewRefreshToken> {
        return {
            newRefreshToken: await this.signAsync(
                { sessionId: sessionId },
                this.jwtAuthSettings.refreshSecret,
                this.jwtAuthSettings.refreshExpire
            ),
        }
    }

    public async verifyAccessToken(
        token: string
    ): Promise<JwtAccessTokenData | null> {
        try {
            const decoded = await this.verifyAsync(
                token,
                this.jwtAuthSettings.accessSecret
            )

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

    public async verifyRefreshToken(
        token: string
    ): Promise<JwtRefreshTokenData | null> {
        try {
            const decoded = await this.verifyAsync(
                token,
                this.jwtAuthSettings.refreshSecret
            )

            // Приводим результат к интерфейсу JwtRefreshTokenData
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
