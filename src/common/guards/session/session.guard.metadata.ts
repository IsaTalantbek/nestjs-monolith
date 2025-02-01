import { SessionGuard } from './session.guard.js'

export enum SGM { // Session Guard Metadata
    unauthorized = 'unauthorized', // Only unauthorized // Только не авторизованным
    authorized = 'authorized', // Only authorized // Только авторизованным
    check = 'check', // Session Check // Только проверка сессии
}

export const SESSION_GUARD_CONSTANT = 'session_guard_constant'

export function UseSessionGuard(only: SGM) {
    return { use: SessionGuard, key: SESSION_GUARD_CONSTANT, metadata: only }
}
