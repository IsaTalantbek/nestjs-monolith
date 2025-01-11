import { IsUUID } from 'class-validator'

export class vsPidBlacklistDto {
    @IsUUID()
    accountId: string

    @IsUUID()
    vsPid: string
}
