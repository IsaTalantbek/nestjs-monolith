import { IsString, MaxLength } from 'class-validator'

export class SupportBodyDTO {
    @IsString()
    @MaxLength(250)
    text: string
}
