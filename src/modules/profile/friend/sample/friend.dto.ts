import { IsIn, IsString, IsUUID } from 'class-validator'

export class vsAidFriendDto {
    @IsUUID()
    accountId: string

    @IsUUID()
    vsAid: string
}

export enum ActiveWaitingFriend {
    active = 'active',
    waiting = 'waiting',
}

export class ActiveWaitingFriendDTO {
    @IsIn(Object.values(ActiveWaitingFriend))
    @IsString()
    option: ActiveWaitingFriend
}
