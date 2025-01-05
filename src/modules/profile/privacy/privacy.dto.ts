import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator'

export class GivePrivacyQueryDto {
    @IsOptional()
    @IsUUID()
    profileId?: string
}

export class UpdatePrivacyBodyDto {
    @IsUUID()
    profileId: string

    @IsString()
    @IsIn(['posts', 'like', 'viewProfile', 'subscribe'])
    update: string

    @IsString()
    @IsIn(['all', 'friends', 'nobody'])
    value: string
}
