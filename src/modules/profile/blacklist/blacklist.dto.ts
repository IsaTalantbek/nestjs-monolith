import { IsUUID } from 'class-validator'

export class VsProfileIdDto {
    @IsUUID()
    vsProfileId: string
}
