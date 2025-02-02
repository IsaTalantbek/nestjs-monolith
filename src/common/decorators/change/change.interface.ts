import { LogMetadataInterface } from '@log-interceptor'
import { SessionRouteInterface } from '@route-decorator'

export interface ChangeInterface {
    guard?: SessionRouteInterface
    log?: LogMetadataInterface
}
