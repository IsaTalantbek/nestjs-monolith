import { IsString, IsOptional } from 'class-validator'

export class QueryDto {
    @IsString()
    type: string

    @IsOptional()
    tags?: Array<string>
}
