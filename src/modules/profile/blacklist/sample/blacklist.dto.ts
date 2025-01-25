import { IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class GiveBlacklistDTO {
    @IsUUID()
    accountId: UUID

    @IsUUID()
    vsPid: UUID
}
