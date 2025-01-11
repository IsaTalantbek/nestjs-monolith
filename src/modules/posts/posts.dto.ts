import { PostType } from '@prisma/client'
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator'

export class GivePostQueryDto {
    @IsString()
    @IsEnum(PostType)
    type: PostType

    @IsOptional()
    tags?: Array<string>
}

export class PostIdDto {
    @IsUUID()
    postId: string
}
