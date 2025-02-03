import {
    applyDecorators,
    SetMetadata,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { LOG_CONSTANT, LoggerInterceptor } from '@interceptor/log'
import { SESSION_GUARD_CONSTANT, SessionGuard } from '@guard/session'
import { ROLE_GUARD_CONSTANT, RoleGuard } from '@guard/role'
import { RouteInterface } from './route.interface.js'

export function Route({
    session: { only, role },
    log: { filename, silent, hide } = {
        filename: 'default',
        silent: true,
        hide: false,
    },
}: RouteInterface): Function {
    const decorators = []

    if (role) {
        decorators.push(SetMetadata(ROLE_GUARD_CONSTANT, role))
        decorators.push(UseGuards(RoleGuard))
    }

    return applyDecorators(
        SetMetadata(LOG_CONSTANT, { filename, silent, hide }),
        UseInterceptors(LoggerInterceptor),
        SetMetadata(SESSION_GUARD_CONSTANT, only),
        UseGuards(SessionGuard),
        ...decorators
    )
}
