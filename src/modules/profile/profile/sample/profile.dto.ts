import { Expose } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class MyAccountDTO {
    @Expose()
    id: string
    @Expose()
    slug: string
    @Expose()
    email: string
    @Expose()
    phone: string
    @Expose()
    createdAt: Date
    @Expose()
    tfaCode: string
    @Expose()
    accountUI: string
}

export class MyProfileDTO {
    @Expose()
    id: string
    @Expose()
    name: string
    @Expose()
    profileType: string
    @Expose()
    profileState: string
    @Expose()
    cityId: string
    @Expose()
    avatarImageId: string
    @Expose()
    coverImageId: string
    @Expose()
    official: boolean
    @Expose()
    shortInfo: JSON
    @Expose()
    extraInfo: JSON
    @Expose()
    otherLinks: JSON
}

export class slugQueryDTO {
    @IsString()
    @IsOptional()
    slug: string
}
