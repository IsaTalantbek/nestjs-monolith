import { SetMetadata } from '@nestjs/common'
import { SGM } from '../guards/session/session.guard'
import { RGM } from '../guards/role/role.guard'

export const SESSION_GUARD_CONSTANT = 'session_guard_constant'
export const ROLE_GUARD_CONSTANT = 'role_guard_constant'

export function Guard(sessionGuard: SGM, role?: RGM): void {
    if (!sessionGuard) {
        throw new Error('Вы не выбрали конкретный гвард в Guard-декораторе')
    }
    SetMetadata(ROLE_GUARD_CONSTANT, role)
    SetMetadata(SESSION_GUARD_CONSTANT, sessionGuard)
    return
}
