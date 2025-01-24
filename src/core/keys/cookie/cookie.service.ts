import { Injectable } from '@nestjs/common'
import { UUID } from 'crypto'
import { FastifyReply } from 'fastify'

interface CookieOption {
    option: 'a' | 'r'
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

    public setCookie(
        reply: FastifyReply,
        token: string, // Уточните ожидаемый формат токена (например, строка)
        option: CookieOption['option']
    ) {
        switch (option) {
            case 'a':
                return reply.setCookie(
                    this.accessTokenName,
                    token,
                    this.cookieSettings
                )
            case 'r':
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
