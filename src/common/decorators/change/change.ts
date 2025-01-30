import { applyDecorators, SetMetadata } from '@nestjs/common'
import {
    LOG_CONSTANT,
    ROLE_GUARD_CONSTANT,
    SESSION_GUARD_CONSTANT,
    GuardRouteInterface,
    LogRouteInterface,
} from '../route/route.decorator.index.js'

interface ChangeInterface {
    guard?: GuardRouteInterface
    log?: LogRouteInterface
}

export function Change({
    guard: { only, role } = { only: undefined, role: undefined },
    log: { filename, silent } = { filename: undefined, silent: undefined },
}: ChangeInterface): Function {
    const decorators = []

    if (only) {
        decorators.push(SetMetadata(SESSION_GUARD_CONSTANT, only))
    }
    if (role) {
        decorators.push(SetMetadata(ROLE_GUARD_CONSTANT, role))
    }
    if (filename && silent) {
        decorators.push(SetMetadata(LOG_CONSTANT, { filename, silent }))
    }
    return applyDecorators(...decorators)
}
