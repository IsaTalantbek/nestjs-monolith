import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

export enum UDE { // User Decorator Enum
    accountId = 'accountId',
    sessionId = 'sessionId',
}

export interface UserDecorator {
    id: UDE
    optional?: boolean
}

export const User = createParamDecorator(
    ({ id, optional = false }: UserDecorator, ctx: ExecutionContext) => {
        const request: FastifyRequest = ctx.switchToHttp().getRequest()
        if (optional === false) {
            const check = request.user[id]
            if (!check) {
                throw new Error(
                    `У пользователя нету request.user, или вы вы указали обязательным ее наличие`
                )
            }
            return check
        }
        return request.user ? request.user[id] : undefined
    }
)
