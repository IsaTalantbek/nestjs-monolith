import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { PrismaService } from 'src/core/database/prisma.service'

const am = './messages/am.txt'
const rm = './messages/rm.txt'

@Injectable()
export class SupportService {
    constructor(private readonly prisma: PrismaService) {}

    async writeSupport(text: string, accountId?: string) {
        const filename = accountId ? am : rm
        const content = accountId ? `${accountId}: ${text}` : text

        await fs.promises.appendFile(filename, content + '\n')
    }

    // Функция 2: очистить файл rm или am
    async clearSupport(accountId: string, fileOption: number) {
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
    async readSupport(accountId: string, fileOption: number) {
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
