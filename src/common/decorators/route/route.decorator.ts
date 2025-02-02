import {
    applyDecorators,
    SetMetadata,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { ROLE_GUARD_CONSTANT, RoleGuard } from '../../guards/role/index.js'
import { LOG_CONSTANT, LoggerInterceptor } from '@log-interceptor'
import { SESSION_GUARD_CONSTANT, SessionGuard } from '@session-guard'
import { RouteInterface } from '@route-decorator'

export function Route({
    session: { only, role },
    log: { filename, silent, hide } = {
        filename: 'default_log_file',
        silent: false,
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
