import { LogMetadataInterface } from '@log-interceptor'
import { RGM } from '@role-guard'
import { SGM } from '@session-guard'

export interface RouteInterface {
    guard: GuardRouteInterface
    log?: LogMetadataInterface
}

export interface GuardRouteInterface {
    only: SGM
    role?: RGM
}
