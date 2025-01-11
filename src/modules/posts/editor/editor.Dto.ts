import { PostType } from '@prisma/client'
import {
    IsString,
    IsOptional,
    IsUUID,
    MaxLength,
    IsArray,
    MinLength,
    ArrayMinSize,
    ArrayMaxSize,
    IsEnum,
} from 'class-validator'

export class EditorDto {
    @IsEnum(PostType)
    type: PostType

    @IsUUID()
    profileId: string

    @IsString()
    @MaxLength(2000)
    text: string

    @IsString()
    @MaxLength(30)
    title: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @MinLength(1, { each: true })
    @MaxLength(20, { each: true })
    @ArrayMinSize(0)
    @ArrayMaxSize(20)
    tags: Array<string> = []
}

export type CreatePostForm = {
    type: PostType
    tags: Array<string>
    accountId: string
    profileId: string
    text: string
    title: string
}
