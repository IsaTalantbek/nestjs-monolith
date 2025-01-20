import { privacyType } from '@prisma/client'
import { Expose } from 'class-transformer'
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class GivePrivacyQueryDTO {
    @IsOptional()
    @IsUUID()
    profileId?: UUID
}

export class UpdatePrivacyBodyDTO {
    @IsUUID()
    profileId: UUID

    @IsString()
    @IsIn(['posts', 'likes', 'viewProfile', 'subscriptions'])
    update: string

    @IsString()
    @IsIn(['all', 'friends', 'nobody'])
    value: string
}

export class GivePrivacyDTO {
    @Expose()
    viewProfile: privacyType
    @Expose()
    likes: privacyType
    @Expose()
    posts: privacyType
    @Expose()
    subscriptions: privacyType
}
