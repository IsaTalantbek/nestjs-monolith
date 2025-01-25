import { UUID } from 'crypto'
import { GiveBlacklistDTO } from './blacklist.dto'

export interface BlacklistService_INTERFACE {
    giveBlacklist(accountId: UUID): Promise<GiveBlacklistDTO[]>
    addToBlacklist(accountId: UUID, vsPid: UUID): Promise<true | string>
    deleteToBlacklist(accountId: UUID, vsPid: UUID): Promise<true | string>
    deleteAllToBlacklist(accountId: UUID): Promise<true | string>
}
