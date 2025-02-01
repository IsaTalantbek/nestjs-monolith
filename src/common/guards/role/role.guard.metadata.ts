import { RoleGuard } from './role.guard.js'

export enum RGM { // Role Guard Metadata
    owner = 'owner',
    admin = 'admin',
    moderator = 'moderator',
    support = 'support',
}

export const ROLE_GUARD_CONSTANT = 'role_guard_constant'

export function UseRoleGuard(role: RGM) {
    return {
        use: RoleGuard,
        key: ROLE_GUARD_CONSTANT,
        metadata: role,
    }
}
