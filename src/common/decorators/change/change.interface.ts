import { SessionRouteInterface } from '@decorator/route'
import { LogMetadataInterface } from '@interceptor/log'

export interface ChangeInterface {
    session?: SessionRouteInterface
    log?: LogMetadataInterface
}
