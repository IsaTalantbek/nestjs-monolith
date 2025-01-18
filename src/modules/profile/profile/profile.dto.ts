import { AccountWithProfile } from '../../../types/prisma'

export interface ProfileServiceInterface {
    myProfile(accountId: string): AccountWithProfile
    userProfile(userPid: string, accountId?: string)
}
