import { IsString, MaxLength } from 'class-validator'

export class SupportBodyDto {
    @IsString()
    @MaxLength(250)
    text: string
}
