import { Expose } from 'class-transformer'
import { UUID } from 'crypto'

export class SubscriptionsDTO {
    @Expose()
    authorPid: UUID
    @Expose()
    subscriberAid: UUID
}
