import { LogMetadataInterface } from '@log-interceptor'
import { RGM } from '@role-guard'
import { SGM } from '@session-guard'

export interface RouteInterface {
    session: SessionRouteInterface
    log?: LogMetadataInterface
}

export interface SessionRouteInterface {
    only: SGM
    role?: RGM
}
