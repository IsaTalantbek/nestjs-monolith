import { SetMetadata } from '@nestjs/common'
import { SGM } from '../guards/session/session.guard.enum.js'
import { RGM } from '../guards/role/role.guard.enum.js'

export const SESSION_GUARD_CONSTANT = 'session_guard_constant'
export const ROLE_GUARD_CONSTANT = 'role_guard_constant'

export function Guard(sessionGuard: SGM, role?: RGM) {
    if (!sessionGuard) {
        throw new Error(
            'Вы не выбрали конкретный сессионый гвард в Guard-декораторе'
        )
    }
    return function (
        target: Object | Function,
        propertyKey?: string | symbol,
        descriptor?: PropertyDescriptor
    ) {
        if (propertyKey !== undefined && descriptor !== undefined) {
            // Метод-декоратор
            SetMetadata(ROLE_GUARD_CONSTANT, role)(
                target,
                propertyKey,
                descriptor
            )
            SetMetadata(SESSION_GUARD_CONSTANT, sessionGuard)(
                target,
                propertyKey,
                descriptor
            )
        } else {
            // Класс-декоратор
            SetMetadata(ROLE_GUARD_CONSTANT, role)(target as Function)
            SetMetadata(
                SESSION_GUARD_CONSTANT,
                sessionGuard
            )(target as Function)
        }
    }
}
