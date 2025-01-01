import { IsUUID } from 'class-validator'

export class VsUserIdDto {
    @IsUUID()
    vsUserId: string
}
