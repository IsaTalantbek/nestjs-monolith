import { UUID } from 'crypto'
import { SubscriptionsDTO } from './subscribe.DTO'

export interface subscribeService_INTERFACE {
    giveSubscriptions(
        accountId?: UUID,
        profileId?: UUID
    ): Promise<string | SubscriptionsDTO[]>
    giveSubscription(
        accountId?: UUID,
        profileId?: UUID
    ): Promise<SubscriptionsDTO>
    subscribe(accountId: UUID, profileId: UUID): Promise<boolean | string>
}
