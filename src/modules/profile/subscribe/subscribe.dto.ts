import { IsOptional, IsUUID } from 'class-validator'

export class GiveSubscribesQueryDto {
    @IsOptional()
    @IsUUID()
    profileId?: string
}
