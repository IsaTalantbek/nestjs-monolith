import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { PrismaService } from '../../core/database/prisma.service.js'
import { SupportServiceInterface } from './support.dto.js'

const am = './messages/support/am.txt' // Authorized Messages
const rm = './messages/support/rm.txt' // Randrom Messages

@Injectable()
export class SupportService implements SupportServiceInterface {
    constructor(private readonly prisma: PrismaService) {}

    async writeSupport(text: string, accountId?: string): Promise<boolean> {
        const filename = accountId ? am : rm
        const content = accountId ? `${accountId}: ${text}` : text

        await fs.promises.appendFile(filename, content + '\n')
        return true
    }

    // Функция 2: очистить файл rm или am
    async clearSupport(
        fileOption: number,
        accountId: string
    ): Promise<boolean | string> {
        const check = await this.prisma.account.findUnique({
            where: { id: accountId },
        })
        if (check.accountRole === 'user') {
            return 'Не имеете доступа'
        }
        const filename = fileOption === 1 ? rm : am

        await fs.promises.writeFile(filename, '') // Очищаем файл
        return true
    }

    // Функция 3: вернуть содержимое файла rm или am
    async readSupport(fileOption: number, accountId: string): Promise<string> {
        const check = await this.prisma.account.findUnique({
            where: { id: accountId },
        })
        if (check.accountRole === 'user') {
            return 'Не имеете доступа'
        }
        const filename = fileOption === 1 ? rm : am
        const data = await fs.promises.readFile(filename, 'utf-8')
        return data
    }
}
