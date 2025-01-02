import {
    IsString,
    IsInt,
    IsOptional,
    IsPositive,
    IsBoolean,
    IsArray,
} from 'class-validator'

export class QueryDto {
    @IsString()
    type: string

    @IsOptional()
    tags?: Array<string>
}
