import {
    applyDecorators,
    SetMetadata,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { SessionGuard, SGM } from '../../guards/session/session.guard.index.js'
import { RGM, RoleGuard } from '../../guards/role/role.guard.index.js'
import { LoggerInterceptor } from '../../../core/log.interceptor.js'

export const SESSION_GUARD_CONSTANT = 'session_guard_constant'
export const ROLE_GUARD_CONSTANT = 'role_guard_constant'
export const LOG_CONSTANT = 'logging_file'

export enum MR { //method Route
    Get = 'get',
    Post = 'post',
    Put = 'put',
    Delete = 'delete',
}

interface RouteInterface {
    guard: GuardRouteInterface
    log?: LogRouteInterface
}

export interface GuardRouteInterface {
    only: SGM
    role?: RGM
}

export interface LogRouteInterface {
    filename: string
    silent: boolean
}

export function Route({
    guard: { only, role },
    log: { filename, silent } = { filename: 'default_log_file', silent: false },
}: RouteInterface): Function {
    const decorators = []

    if (role) {
        decorators.push(SetMetadata(ROLE_GUARD_CONSTANT, role))
        decorators.push(UseGuards(RoleGuard))
    }

    return applyDecorators(
        SetMetadata(LOG_CONSTANT, { filename, silent }),
        UseInterceptors(LoggerInterceptor),
        SetMetadata(SESSION_GUARD_CONSTANT, only),
        UseGuards(SessionGuard),
        ...decorators
    )
}
