import { SetMetadata } from '@nestjs/common'
import { SGM } from '../../guards/session/session.guard.index.js'
import { RGM } from '../../guards/role/role.guard.index.js'

export const SESSION_GUARD_CONSTANT = 'session_guard_constant'
export const ROLE_GUARD_CONSTANT = 'role_guard_constant'

interface GuardDecorator {
    only: SGM
    role?: RGM
}

export function GuardConfig({ only, role }: GuardDecorator): Function {
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
            SetMetadata(SESSION_GUARD_CONSTANT, only)(
                target,
                propertyKey,
                descriptor
            )
        } else {
            // Класс-декоратор
            SetMetadata(ROLE_GUARD_CONSTANT, role)(target as Function)
            SetMetadata(SESSION_GUARD_CONSTANT, only)(target as Function)
        }
    }
}
