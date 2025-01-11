import { IsUUID } from 'class-validator'

export class vsAidFriendDto {
    @IsUUID()
    accountId: string

    @IsUUID()
    vsAid: string
}
