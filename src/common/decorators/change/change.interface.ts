import { LogMetadataInterface } from '@log-interceptor'
import { GuardRouteInterface } from '@route-decorator'

export interface ChangeInterface {
    guard?: GuardRouteInterface
    log?: LogMetadataInterface
}
