import {
    IsString,
    IsInt,
    IsOptional,
    IsPositive,
    IsBoolean,
    IsUUID,
    MaxLength,
    IsJSON,
    IsArray,
} from 'class-validator'

export class EditorDto {
    @IsString()
    type: string

    @IsUUID()
    profileId: string

    @IsString()
    @MaxLength(2000)
    text: string

    @IsOptional()
    @IsArray()
    tags: Array<string>
}
