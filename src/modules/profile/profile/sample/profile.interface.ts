import { Post, Subscription } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { MyAccountDTO, MyProfileDTO } from './profile.dto'

export type ProfilePrivacyStats = Prisma.ProfileGetPayload<{
    include: { privacy: true; stats: true }
}>
export type AccountWithProfile = Prisma.AccountGetPayload<{
    include: { profiles: true }
}>

export interface ProfileService_INTERFACE {
    myProfile(
        accountId: string,
        profileId?: string
    ): Promise<MyProfileDTO | string>
    myAccount(accountId: string): Promise<MyAccountDTO>
    userProfile(
        userPid: string,
        accountId?: string
    ): Promise<MinData | UserProfileData | string>
}

export interface MinData {
    name: string
    avatarImage: string | null
    coverImage: string | null
}

export interface FullData extends MinData {
    offcial: boolean
    shortInfo?: string
    extraInfo?: string
    otherLinks: string[]
    subscribers: number
}

export interface UserProfileData {
    fullData?: FullData
    subscription?: Subscription[]
    posts?: Post[]
    likes?: number
    dislikes?: number
    ratio?: number
}
