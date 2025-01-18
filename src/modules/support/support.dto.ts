import { IsString, MaxLength } from 'class-validator'

export class SupportBodyDto {
    @IsString()
    @MaxLength(250)
    text: string
}

export interface SupportServiceInterface {
    writeSupport(text: string, accountId?: string): Promise<boolean>
    clearSupport(
        fileOption: number,
        accountId?: string
    ): Promise<boolean | string>
    readSupport(fileOption: number, accountId?: string): Promise<string>
}
