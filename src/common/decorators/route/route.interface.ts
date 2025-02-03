import { RGM } from '@guard/role'
import { SGM } from '@guard/session'
import { LogMetadataInterface } from '@interceptor/log'

export interface RouteInterface {
    session: SessionRouteInterface
    log?: LogMetadataInterface
}

export interface SessionRouteInterface {
    only: SGM
    role?: RGM
}
