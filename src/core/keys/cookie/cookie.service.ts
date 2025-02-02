import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UUID } from 'crypto'
import { FastifyReply } from 'fastify'

export enum CookieN { // Cookie Name
    access, // Access Token
    refresh, // Refresh Token
}

export interface UserDataArray {
    data: [string, string]
}

export interface UserData {
    accountId: UUID
    sessionId: UUID
}

@Injectable()
export class CookieService {
    constructor(private readonly config: ConfigService) {}

    get cookieSettings() {
        return {
            httpOnly: true,
            secure: true,
            maxAge: Number(this.config.get<number>('COOKIE_MAX_EXPIRE')),
            sameSite: 'strict' as 'strict',
            path: '/',
        }
    }

    get accessTokenName() {
        return this.config.get<string>('COOKIE_ACCESS_NAME')
    }

    get refreshTokenName() {
        return this.config.get<string>('COOKIE_REFRESH_NAME')
    }

    public setCookie(reply: FastifyReply, token: string, option: CookieN) {
        switch (option) {
            case CookieN.access:
                return reply.setCookie(
                    this.accessTokenName,
                    token,
                    this.cookieSettings
                )
            case CookieN.refresh:
                return reply.setCookie(
                    this.refreshTokenName,
                    token,
                    this.cookieSettings
                )
            default:
                throw new Error(`Некорректный параметр option: ${option}`) // Этот случай более описательный
        }
    }

    public clearCookie(reply: FastifyReply, ...args: string[]) {
        args.forEach((cookie) => reply.clearCookie(cookie))
    }

    public userData(data: UserData | UserDataArray): UserData {
        // Если session — объект
        if (data && typeof data === 'object') {
            const newData = (data as UserDataArray).data

            // Если есть поле `data` и оно массив строк
            if (
                Array.isArray(newData) &&
                newData.length === 2 &&
                newData.every((item) => typeof item === 'string')
            ) {
                return {
                    accountId: newData[0],
                    sessionId: newData[1],
                } as UserData
            }

            // Если это просто объект с другими свойствами
            const { accountId, sessionId } = data as UserData

            return {
                accountId: accountId,
                sessionId: sessionId,
            } as UserData
        }

        // Если данные имеют неизвестный формат
        throw new Error('Invalid session format')
    }
}
