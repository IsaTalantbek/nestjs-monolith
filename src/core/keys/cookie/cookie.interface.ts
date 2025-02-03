import { UUID } from 'crypto'

export enum CN { // Cookie Name
    access, // Access Token
    refresh, // Refresh Token
}

export interface UserDataArray {
    data: [string, string]
}

export interface UserData {
    accountId: UUID
    sessionId: UUID
}
