import { UUID } from 'crypto'
import { ActiveWaitingFriend } from './friend.dto.js'
import { GiveFriendsDTO } from '../../privacy/sample/privacy.dto.js'

export interface FriendService_INTERFACE {
    giveFriends(
        accountId: UUID,
        option: ActiveWaitingFriend
    ): Promise<GiveFriendsDTO[]>
    addFriend(accountId: UUID, vsAid: UUID): Promise<boolean | string>
    acceptFriend(accountId: UUID, profileId: UUID): Promise<boolean | string>
    deleteFriend(accountId: UUID, vsAid: UUID): Promise<boolean | string>
}
