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
}
