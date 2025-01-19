import { IsOptional, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class GiveSubscriptionQueryDto {
    @IsOptional()
    @IsUUID()
    profileId?: UUID
}
