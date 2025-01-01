import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service'

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) {}

    async profile(userId: string) {
        return await this.prisma.account.findUnique({
            where: { id: userId },
        })
    }
    async addToBlackList(userId: string, vsUserId: string) {
        if (userId === vsUserId) {
            return 'Нельзя добавить себя в черный список'
        }
        const check = await this.prisma.account.findUnique({
            where: { id: vsUserId },
        })
        if (!check) {
            return false
        }
        return await this.prisma.blackList.create({
            data: { userId, vsUserId, createBy: 'profileService' },
        })
    }
}
