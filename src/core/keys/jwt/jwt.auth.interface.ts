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
