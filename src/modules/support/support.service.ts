import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { PrismaService } from 'src/core/database/prisma.service'

const am = './messages/am.txt'
const rm = './messages/rm.txt'

@Injectable()
export class SupportService {
    constructor(private readonly prisma: PrismaService) {}

    async writeSupport(text: string, userId?: string) {
        const filename = userId ? am : rm
        const content = userId ? `${userId}: ${text}` : text

        await fs.promises.appendFile(filename, content + '\n')
    }

    // Функция 2: очистить файл rm или am
    async clearSupport(userId: string, fileOption: number) {
        const check = await this.prisma.account.findUnique({
            where: { id: userId },
        })
        if (check.accountRole === 'user') {
            return 'Не имеете доступа'
        }
        const filename = fileOption === 1 ? rm : am

        await fs.promises.writeFile(filename, '') // Очищаем файл
        return true
    }

    // Функция 3: вернуть содержимое файла rm или am
    async readSupport(userId: string, fileOption: number) {
        const check = await this.prisma.account.findUnique({
            where: { id: userId },
        })
        if (check.accountRole === 'user') {
            return 'Не имеете доступа'
        }
        const filename = fileOption === 1 ? rm : am
        const data = await fs.promises.readFile(filename, 'utf-8')
        return data
    }
}
