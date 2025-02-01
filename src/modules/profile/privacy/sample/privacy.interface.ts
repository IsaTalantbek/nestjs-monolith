import { Prisma } from '@prisma/client'
import { UUID } from 'crypto'
import { GivePrivacyDTO } from './privacy.dto.js'

export type ProfileWithPrivacy = Prisma.ProfileGetPayload<{
    include: { privacy: true }
}>

export interface PrivacyService_INTERFACE {
    givePrivacy(
        accountId?: string,
        profileId?: string
    ): Promise<GivePrivacyDTO | string>
    updatePrivacy(
        profileId: UUID,
        update: string,
        value: string,
        accountId: UUID
    ): Promise<boolean | string>
}
