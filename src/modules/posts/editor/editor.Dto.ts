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

enum EditorDtoTypes {
    article = 'article',
    poetry = 'poetry',
}

export class EditorDto {
    @IsEnum(EditorDtoTypes)
    type: string

    @IsUUID()
    profileId: string

    @IsString()
    @MaxLength(2000)
    text: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @MinLength(1, { each: true })
    @ArrayMinSize(0)
    @ArrayMaxSize(20)
    tags: Array<string> = []
}
