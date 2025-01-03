import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator'

enum PostsDtoTypes {
    article = 'article',
    poetry = 'poetry',
}

export class GivePostQueryDto {
    @IsString()
    @IsEnum(PostsDtoTypes)
    type: string

    @IsOptional()
    tags?: Array<string>
}

export class PostIdDto {
    @IsString()
    postId: string
}
