export enum UDE { // User Decorator Enum
    accountId = 'accountId',
    sessionId = 'sessionId',
}

export interface UserDecoratorOptions {
    id: UDE
    optional?: boolean
}
