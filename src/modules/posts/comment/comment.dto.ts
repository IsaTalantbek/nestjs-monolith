import {
    IsString,
    IsOptional,
    IsUUID,
    MaxLength,
    MinLength,
} from 'class-validator'

export class WriteCommentDto {
    @IsString()
    @MaxLength(250)
    @MinLength(1)
    text: string

    @IsUUID()
    postId: string

    @IsUUID()
    profileId: string

    @IsOptional()
    @IsUUID()
    commentId: string
}

export class UpdateCommentDto {
    @IsString()
    @MaxLength(250)
    @MinLength(1)
    text: string

    @IsUUID()
    commentId: string
}
