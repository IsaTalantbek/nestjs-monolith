import { UUID } from 'crypto'

export interface SupportService_INTERFACE {
    writeSupport(text: string, accountId?: UUID): Promise<true>
    clearSupport(fileOption: number, accountId?: UUID): Promise<true | string>
    readSupport(fileOption: number, accountId?: string): Promise<string>
}
